import { ProcCtx } from './types.js'

export function handler<TProcessedCtx, TRes>(
  ctxFn: (ctx: ProcCtx) => TProcessedCtx,
  fn: (ctx: Awaited<TProcessedCtx>) => TRes,
) {
  return {
    __ctxFn: ctxFn,
    run: async (ctx: ProcCtx) => {
      const processedCtx = await ctxFn(ctx)
      return fn(processedCtx)
    },
  }
}
