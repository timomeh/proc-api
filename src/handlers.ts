import { ProzCtx, ProzHandler } from './types.js'

export function query<TProcessedCtx extends ProzCtx, TResult>(
  ctxFn: (ctx: ProzCtx) => Promise<TProcessedCtx>,
  fn: (ctx: TProcessedCtx) => TResult,
): ProzHandler<TProcessedCtx, 'query', TResult> {
  return {
    __type: 'query',
    __ctxFn: ctxFn,
    run: async (ctx: ProzCtx) => {
      const processedCtx = await ctxFn(ctx)
      return fn(processedCtx)
    },
  }
}

export function mutation<TProcessedCtx extends ProzCtx, TResult>(
  ctxFn: (ctx: ProzCtx) => Promise<TProcessedCtx>,
  fn: (ctx: TProcessedCtx) => TResult,
): ProzHandler<TProcessedCtx, 'mutation', TResult> {
  return {
    __type: 'mutation',
    __ctxFn: ctxFn,
    run: async (ctx: ProzCtx) => {
      const processedCtx = await ctxFn(ctx)
      return fn(processedCtx)
    },
  }
}
