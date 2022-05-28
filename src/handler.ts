import { Ctx } from './types.js'

export function handler<TProcessedCtx, TRes>(
  ctxFn: (ctx: Ctx) => TProcessedCtx,
  fn: (ctx: Awaited<TProcessedCtx>) => TRes,
) {
  return {
    __ctxFn: ctxFn,
    run: async (ctx: Ctx) => {
      const processedCtx = await ctxFn(ctx)
      return fn(processedCtx)
    },
  }
}
