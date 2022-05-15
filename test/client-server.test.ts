import { expect, test, afterAll, afterEach, beforeAll } from 'vitest'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import fetch from 'node-fetch'
import httpMocks from 'node-mocks-http'

import { createClient, createServer } from '../src/index.js'

const api = createServer(
  {
    listNumbers: async () => [1, 2, 3],
    getConstFoo: () => 'foo' as const,
  },
  {
    prefix: '/api/',
  },
)

const client = createClient<typeof api>({
  fetch: (procName) =>
    fetch(`http://test.tld/api/${procName}`).then((res) => res.json()),
})

test('calls a proc and receives the value', async () => {
  expect(await client.listNumbers()).toEqual([1, 2, 3])
  expect(await client.getConstFoo()).toEqual('foo')
})

const server = setupServer(
  rest.all('http://test.tld/api/*', async (req, res, ctx) => {
    const foo = await api.handler(
      httpMocks.createRequest({
        url: req.url.toString(),
      }),
      httpMocks.createResponse(),
    )
    return res(ctx.json(foo))
  }),
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
