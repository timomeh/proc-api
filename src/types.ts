import type { IncomingMessage, ServerResponse } from 'node:http'

export type ProzRequest = IncomingMessage & {
  body: any
  query: {
    [key: string]: string | string[]
  }
}
export type ProzResponse = ServerResponse

export type ProzCtx = {
  req: ProzRequest
  res: ProzResponse
}

type ProzHandlerType = 'query' | 'mutation'

export type ProzHandler<
  TProcessedCtx extends ProzCtx = ProzCtx,
  TType extends ProzHandlerType = ProzHandlerType,
  THandlerResult = any,
> = {
  __type: TType
  __ctxFn: (ctx: ProzCtx) => Promise<TProcessedCtx>
  run: (ctx: ProzCtx) => Promise<THandlerResult>
}

export type ProzQuery<TCtxFn extends ProzCtx = ProzCtx> = ProzHandler<
  TCtxFn,
  'query'
>

export type ProzMutation<TCtxFn extends ProzCtx = ProzCtx> = ProzHandler<
  TCtxFn,
  'mutation'
>

export type ProzHandlers = Record<string, ProzHandler>

export type ProzResolver<THandlers extends ProzHandlers = ProzHandlers> = {
  __handlers: THandlers
  handleRequest: (req: ProzRequest, res: ProzResponse) => Promise<any>
}

export type FetchOptions = {
  name: string
  method: 'GET' | 'POST'
  body?: any
  params?: any
}

export type ProzClientOptions = {
  fetch: (opts: FetchOptions) => Promise<unknown>
}

export type Validator<TValidated> = (input: any) => Promise<TValidated>
