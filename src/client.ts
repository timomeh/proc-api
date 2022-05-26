import { Ctx, ProcHandler, ProcServer } from './types.js'

type ClientOptions = {
  fetch: (opts: {
    proc: string
    method: 'GET' | 'POST'
    body?: any
    params?: any
  }) => Promise<unknown>
}

type ExCtx = Ctx & { params?: any; body?: any }

type ProcHandlerCtx<TProcHandler extends ProcHandler<ExCtx>> = Awaited<
  ReturnType<TProcHandler['__ctxFn']>
>

type OptionalArg<
  TKey extends 'params' | 'body',
  TProcHandler extends ProcHandler<ExCtx>,
> = ProcHandlerCtx<TProcHandler> extends { [Property in TKey]: unknown }
  ? [ProcHandlerCtx<TProcHandler>[TKey]]
  : []

type CreateCallables<
  TCallable extends Record<string, ProcHandler<Ctx>>,
  TInputKey extends 'params' | 'body',
> = {
  [Property in keyof TCallable]: (
    ...params: OptionalArg<TInputKey, TCallable[Property]>
  ) => Promise<Awaited<ReturnType<TCallable[Property]['run']>>>
}

export function createClient<TProcServer extends ProcServer>(
  opts: ClientOptions,
) {
  return {
    query: new Proxy(
      {} as CreateCallables<TProcServer['__resolvers']['query'], 'params'>,
      {
        get(_target, procName: string) {
          return async function (params: any) {
            return opts.fetch({ method: 'GET', proc: procName, params })
          }
        },
      },
    ),
    mutate: new Proxy(
      {} as CreateCallables<TProcServer['__resolvers']['mutate'], 'body'>,
      {
        get(_target, procName: string) {
          return async function (body: any) {
            return opts.fetch({ method: 'POST', proc: procName, body })
          }
        },
      },
    ),
  }
}
