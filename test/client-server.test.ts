import { expect, test, afterAll, afterEach, beforeAll } from 'vitest'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import fetch from 'node-fetch'
import httpMocks, { RequestMethod } from 'node-mocks-http'

import { createClient, createServer } from '../src/index.js'
import { proc } from '../src/proc.js'

const procServer = createServer({
  query: {
    items: proc.handler(
      proc.pipe(
        async (ctx) => ({ ...ctx, user: 'user:1' as const }),
        async (ctx) => ({ ...ctx, foo: 'bar:1' }),
      ),
      async (ctx) => {
        return {
          user: ctx.user,
          items: [{ id: 1 }, { id: 2 }, { id: 3 }],
        }
      },
    ),
  },
  mutate: {
    createItem: proc.handler(
      proc.pipe(
        async (ctx) => ({ ...ctx, user: 'user:1' }),
        async (ctx) => ({ ...ctx, foo: 'bar:1' }),
      ),
      async (_ctx) => {
        return { id: 'new' }
      },
    ),
  },
})

const client = createClient<typeof procServer>({
  fetch: async ({ proc, method }) => {
    const res = await fetch(`http://test.tld/api/${proc}`, { method })
    const data = await res.json()
    return data
  },
})

test('calls a proc and receives the value', async () => {
  expect(await client.mutate.createItem()).toEqual({ id: 'new' })
  expect(await client.query.items()).toEqual({
    user: 'user:1',
    items: [{ id: 1 }, { id: 2 }, { id: 3 }],
  })
})

const server = setupServer(
  rest.all('http://test.tld/api/*', async (req, res, ctx) => {
    const resWithJson = httpMocks.createResponse()
    resWithJson.json = (data: any) => res(ctx.json(data))

    return await procServer.createHandler({ prefix: '/api' })(
      httpMocks.createRequest({
        url: req.url.toString(),
        method: req.method as RequestMethod,
      }),
      resWithJson,
    )
  }),
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
