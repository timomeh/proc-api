import { afterAll, afterEach, beforeAll } from 'vitest'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import httpMocks, { RequestMethod } from 'node-mocks-http'
import got from 'got'

import { ProcServer, FetchOptions } from '../../src/index.js'

export const fetch = async ({ proc, method, body, params }: FetchOptions) => {
  return got(`http://test.tld/api/${proc}`, {
    method,
    json: body,
    searchParams: new URLSearchParams(params),
    retry: {
      limit: 0,
    },
    throwHttpErrors: false, // makes it easier to test
  }).json()
}

export function createTestServer(procServer: ProcServer) {
  const server = setupServer(
    rest.all('http://test.tld/api/*', async (req, res, ctx) => {
      try {
        const data = await procServer.handleRequest(
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
}
