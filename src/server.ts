import { CreatedServer, Procs } from './types.js'

type Options = {
  prefix?: string
}

export function createServer<TProcs extends Procs>(
  procs: TProcs,
  opts: Options,
) {
  const handler: CreatedServer['handler'] = (req, res) => {
    const url = new URL(req.url!, `http://${req.headers.host}`)
    const procName = url.pathname.replace(opts.prefix || '/', '')
    return procs[procName]()
  }

  return {
    procs,
    handler,
  }
}
