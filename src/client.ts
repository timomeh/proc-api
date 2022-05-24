import { Ctx, ProcHandler, ProcServer } from './types.js'

type ClientOptions = {
  fetch: (opts: { proc: string; method: 'GET' | 'POST' }) => Promise<unknown>
}

type CreateCallables<TCallable extends Record<string, ProcHandler<Ctx>>> = {
  [Property in keyof TCallable]: () => ReturnType<TCallable[Property]['call']>
}

export function createClient<TProcServer extends ProcServer>(
  opts: ClientOptions,
) {
  return {
    query: new Proxy(
      {} as CreateCallables<TProcServer['__resolvers']['query']>,
      {
        get(_target, procName: string) {
          return async function () {
            return opts.fetch({ method: 'GET', proc: procName })
          }
        },
      },
    ),
    mutate: new Proxy(
      {} as CreateCallables<TProcServer['__resolvers']['mutate']>,
      {
        get(_target, procName: string) {
          return async function () {
            return opts.fetch({ method: 'POST', proc: procName })
          }
        },
      },
    ),
  }
}
