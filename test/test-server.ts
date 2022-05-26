import { afterAll, afterEach, beforeAll } from 'vitest'
import got from 'got'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
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
        ] as const

        return items.filter((item) => item.status === ctx.params.status)
      },
    ),
  },
  mutate: {
    createItem: proc.handler(
      proc.pipe((ctx) => ({
        ...ctx,
        body: { id: ctx.req.body.id },
      })),
      async (ctx) => {
        return { id: ctx.body.id, name: 'new item' }
      },
    ),
  },
})

export const client = createClient<typeof procServer>({
  fetch: async ({ proc, method, body, params }) => {
    return got(`http://test.tld/api/${proc}`, {
      method,
      json: body,
      searchParams: new URLSearchParams(params),
    }).json()
  },
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
