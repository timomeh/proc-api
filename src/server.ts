import {
  Resolvers,
  ProcRequest,
  ProcResponse,
  ProcServer,
  CreateHandlerOptions,
} from './types.js'

export function createServer<TResolvers extends Resolvers>(
  resolvers: TResolvers,
): ProcServer<TResolvers> {
  function createHandler(opts: CreateHandlerOptions) {
    return async function handler(req: ProcRequest, res: ProcResponse) {
      const url = new URL(req.url!, `http://${req.headers.host}`)
      const procName = url.pathname
        .replace(opts.prefix || '/', '')
        .replace(/\//, '')

      const type = req.method?.toLowerCase() === 'get' ? 'query' : 'mutate'
      const proc = resolvers[type]?.[procName]
      if (!proc) {
        res.statusCode = 404
        const notFoundError = new Error('Not Found')
        Object.assign(notFoundError, { status: 404, statusCode: 404 })
        throw notFoundError
      }

      const data = await proc.run({ req, res })
      return data
    }
  }

  return {
    __resolvers: resolvers,
    createHandler,
  }
}
