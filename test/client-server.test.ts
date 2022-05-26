import { expect, test, afterAll, afterEach, beforeAll } from 'vitest'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import got from 'got'
import httpMocks, { RequestMethod } from 'node-mocks-http'

import { createClient, createServer, proc } from '../src/index.js'

const procServer = createServer({
  query: {
    items: proc.handler(
      proc.pipe((ctx) => ({
        ...ctx,
        params: { status: ctx.req.query.status as 'todo' | 'done' },
      })),
      async (ctx) => {
        const items = [
          { id: 1, status: 'todo' },
          { id: 2, status: 'done' },
          { id: 3, status: 'todo' },
        ]

        return items.filter((item) => item.status === ctx.params.status)
      },
    ),
  },
  mutate: {
    createItem: proc.handler(
      proc.pipe(
        async (ctx) => ({ ...ctx, user: 'user:1' }),
        async (ctx) => {
          return { ...ctx, body: { id: ctx.req.body.id } }
        },
      ),
      async (ctx) => {
        return { id: ctx.body.id, name: 'new item' }
      },
    ),
  },
})

const client = createClient<typeof procServer>({
  fetch: async ({ proc, method, body, params }) => {
    return got(`http://test.tld/api/${proc}`, {
      method,
      json: body,
      searchParams: params,
    }).json()
  },
})

test('calls a query with params and receives the correct value', async () => {
  expect(await client.query.items({ status: 'todo' })).toEqual([
    { id: 1, status: 'todo' },
    { id: 3, status: 'todo' },
  ])
})

test('calls a mutation with a body and receives the correct value', async () => {
  expect(await client.mutate.createItem({ id: 'qux' })).toEqual({
    id: 'qux',
    name: 'new item',
  })
})

const handler = procServer.createHandler({ prefix: '/api/' })

const server = setupServer(
  rest.all('http://test.tld/api/*', async (req, res, ctx) => {
    const data = await handler(
      httpMocks.createRequest({
        url: req.url.toString(),
        method: req.method as RequestMethod,
        body: req.body as unknown,
        params: req.params as unknown,
      }),
      httpMocks.createResponse(),
    )

    return res(ctx.json(data))
  }),
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
