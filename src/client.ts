import {
  ProzClientOptions,
  ProzCtx,
  ProzHandler,
  ProzResolver,
  ProzHandlers,
} from './types.js'

type ExCtx = ProzCtx & { params?: any; body?: any }

type FinalProzHandlerCtx<TProcHandler extends ProzHandler<ExCtx>> = Awaited<
  ReturnType<TProcHandler['__ctxFn']>
>

type OptionalArg<
  TKey extends 'params' | 'body',
  THandler extends ProzHandler<ExCtx>,
> = FinalProzHandlerCtx<THandler> extends { [Property in TKey]: unknown }
  ? [FinalProzHandlerCtx<THandler>[TKey]]
  : []

type CreateQueryHandlers<THandlers extends ProzHandlers> = {
  [Property in keyof THandlers as THandlers[Property]['__type'] extends 'query'
    ? Property
    : never]: (
    ...params: OptionalArg<'params', THandlers[Property]>
  ) => Promise<Awaited<ReturnType<THandlers[Property]['run']>>>
}

type CreateMutationHandlers<THandlers extends ProzHandlers> = {
  [Property in keyof THandlers as THandlers[Property]['__type'] extends 'mutation'
    ? Property
    : never]: (
    ...params: OptionalArg<'body', THandlers[Property]>
  ) => Promise<Awaited<ReturnType<THandlers[Property]['run']>>>
}

export function createProzClient<TResolver extends ProzResolver>(
  opts: ProzClientOptions,
) {
  return {
    query: new Proxy({} as CreateQueryHandlers<TResolver['__handlers']>, {
      get(_target, name: string) {
        return async function (params: any) {
          return opts.fetch({ method: 'GET', name, params })
        }
      },
    }),
    mutate: new Proxy({} as CreateMutationHandlers<TResolver['__handlers']>, {
      get(_target, name: string) {
        return async function (body: any) {
          return opts.fetch({ method: 'POST', name, body })
        }
      },
    }),
  }
}
