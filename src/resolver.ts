import {
  ProzHandlers,
  ProzResolver,
  ProzRequest,
  ProzResponse,
} from './types.js'

export function createProzResolver<THandlers extends ProzHandlers>(
  handlers: THandlers,
): ProzResolver<THandlers> {
  async function handleRequest(req: ProzRequest, res: ProzResponse) {
    const url = new URL(req.url!, `https://${req.headers.host}`)
    const handlerName = url.pathname.split('/').pop()!

    const handler = handlers[handlerName]

    if (!handler) {
      res.statusCode = 404
      const notFoundError = new Error('Not Found')
      Object.assign(notFoundError, { status: 404, statusCode: 404 })
      throw notFoundError
    }

    const reqMethod = (req.method || 'GET').toUpperCase()

    if (
      (handler.__type === 'query' && reqMethod !== 'GET') ||
      (handler.__type === 'mutation' && reqMethod !== 'POST')
    ) {
      res.statusCode = 405
      const wrongMethodError = new Error(
        `Handler ${handlerName} is a ${handler.__type} but was called using HTTP method "${reqMethod}"`,
      )
      Object.assign(wrongMethodError, { status: 405, statusCode: 405 })
      throw wrongMethodError
    }

    const data = await handler.run({ req, res })
    return data
  }

  return {
    __handlers: handlers,
    handleRequest,
  }
}
