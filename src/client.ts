import { CreatedServer, Procs } from './types.js'

type ClientOptions = {
  fetch: (url: string) => Promise<unknown>
}

type AsyncCall<TProcs extends Procs> = {
  [K in keyof TProcs]: ReturnType<TProcs[K]> extends Promise<unknown>
    ? TProcs[K]
    : (...args: Parameters<TProcs[K]>) => Promise<ReturnType<TProcs[K]>>
}

export function createClient<TServer extends CreatedServer>(
  opts: ClientOptions,
) {
  return new Proxy<AsyncCall<TServer['procs']>>(
    {} as AsyncCall<TServer['procs']>,
    {
      get(_target, procName: string) {
        return async function () {
          return opts.fetch(procName)
        }
      },
    },
  )
}
