import type { IncomingMessage, ServerResponse } from 'node:http'

export type ProcRequest = IncomingMessage
export type ProcResponse = ServerResponse & { json: (data: any) => void }

export type Ctx = {
  req: ProcRequest
  res: ProcResponse
}

export type ProcHandler<TCtxFn> = {
  __ctxFn: (ctx: Ctx) => Promise<TCtxFn>
  call: (ctx: Ctx) => Promise<any>
}

export type Resolvers = {
  query: Record<string, ProcHandler<Ctx>>
  mutate: Record<string, ProcHandler<Ctx>>
}

export type ProcServer<TResolvers extends Resolvers = Resolvers> = {
  __resolvers: TResolvers
  createHandler: (
    opts: CreateHandlerOptions,
  ) => (req: ProcRequest, res: ProcResponse) => Promise<void>
}

export type CreateHandlerOptions = {
  prefix?: string
}
