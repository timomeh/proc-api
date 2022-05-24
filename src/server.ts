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

      let type: 'mutate' | 'query' = 'mutate'
      if (req.method?.toLowerCase() === 'get') {
        type = 'query'
      }

      const proc = resolvers[type]?.[procName]
      if (!proc) {
        throw new Error('no proc!')
      }

      const data = await proc.call({ req, res })
      return res.json(data)
    }
  }

  return {
    __resolvers: resolvers,
    createHandler,
  }
}
