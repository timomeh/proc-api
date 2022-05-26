import { afterAll, afterEach, beforeAll } from 'vitest'

import { rest } from 'msw'
import { setupServer } from 'msw/node'
import httpMocks, { RequestMethod } from 'node-mocks-http'

import got from 'got'
import { z } from 'zod'
import * as yup from 'yup'

import { createClient, createServer, proc } from '../src/index.js'

const items = [
  { id: 1, status: 'todo' },
  { id: 2, status: 'done' },
  { id: 3, status: 'todo' },
  { id: 4, status: 'todo' },
] as const

const procServer = createServer({
  query: {
    items: proc.handler(
      proc.pipe((ctx) => ctx),
      async () => {
        return items
      },
    ),
    zodItems: proc.handler(
      proc.pipe(
        proc.zodParams(
          z.object({
            status: z.union([z.literal('todo'), z.literal('done')]),
            limit: z.preprocess(
              (val: any) => (val ? parseInt(val) : undefined),
              z.number().default(Infinity).nullable(),
            ),
          }),
        ),
      ),
      async (ctx) => {
        return items
          .filter((item) => item.status === ctx.params.status)
          .splice(0, ctx.params.limit)
      },
    ),
    yupItems: proc.handler(
      proc.pipe(
        proc.yupParams(
          yup.object({
            status: yup.string().oneOf(['todo', 'done']).required(),
            limit: yup.number(),
          }),
        ),
      ),
      async (ctx) => {
        return items
          .filter((item) => item.status === ctx.params.status)
          .splice(0, ctx.params.limit || Infinity)
      },
    ),
  },
  mutate: {
    createItem: proc.handler(
      proc.pipe((ctx) => ({ ...ctx, body: { id: ctx.req.body.id } })),
      async (ctx) => {
        return { id: ctx.body.id, name: 'new item' }
      },
    ),
    zodCreateItem: proc.handler(
      proc.pipe(
        proc.zodBody(
          z.object({ id: z.union([z.literal('qux'), z.literal('baz')]) }),
        ),
      ),
      async (ctx) => {
        return { id: ctx.body.id, name: 'new item' }
      },
    ),
    yupCreateItem: proc.handler(
      proc.pipe(
        proc.yupBody(
          yup.object({
            id: yup.string().oneOf(['qux', 'baz']).required(),
          }),
        ),
      ),
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
      retry: {
        limit: 0,
      },
      throwHttpErrors: false, // makes it easier to test
    }).json()
  },
})

const handler = procServer.createHandler({ prefix: '/api/' })

const server = setupServer(
  rest.all('http://test.tld/api/*', async (req, res, ctx) => {
    try {
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
    } catch (error) {
      return res(
        ctx.status(error.statusCode || 500),
        ctx.json({
          error: error.name,
          issues: error.issues,
          errors: error.errors,
        }),
      )
    }
  }),
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
