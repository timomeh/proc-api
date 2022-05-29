import type { z, AnyZodObject as ZodInput } from 'zod'
import type { InferType as YupInfer, AnyObjectSchema as YupInput } from 'yup'
import { ProzCtx, Validator } from './types.js'

type Ctx = ProzCtx

type CtxType = 'params' | 'body'
type ValidationCtx<TType extends CtxType, TValidated, TCtx> = (
  ctx: TCtx,
) => Promise<TCtx & { [Property in TType]: TValidated }>

export function params<TZod extends ZodInput, TCtx>(
  schema: TZod,
): ValidationCtx<'params', z.infer<TZod>, TCtx>
export function params<TYup extends YupInput, TCtx>(
  schema: TYup,
): ValidationCtx<'params', YupInfer<TYup>, TCtx>
export function params<TValidated, TCtx>(
  schema: Validator<TValidated>,
): ValidationCtx<'params', TValidated, TCtx>
export function params(schema: any) {
  return async (ctx: Ctx) => {
    const validated = await validate(schema, ctx.req.query)
    return { ...ctx, params: validated }
  }
}

export function body<TZod extends ZodInput, TCtx>(
  schema: TZod,
): ValidationCtx<'body', z.infer<TZod>, TCtx>
export function body<TYup extends YupInput, TCtx>(
  schema: TYup,
): ValidationCtx<'body', YupInfer<TYup>, TCtx>
export function body<TValidated, TCtx>(
  schema: Validator<TValidated>,
): ValidationCtx<'body', TValidated, TCtx>
export function body(schema: any) {
  return async (ctx: Ctx) => {
    const validated = await validate(schema, ctx.req.body)
    return { ...ctx, body: validated }
  }
}

async function validate(schema: any, input: any) {
  if (schema.constructor.name === 'ObjectSchema') {
    return await schema.validate(input)
  }

  // zod
  if (schema.constructor.name === 'ZodObject') {
    return await schema.parseAsync(input)
  }

  // other
  return await schema(input)
}
