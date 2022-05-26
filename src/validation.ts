import { Ctx } from './types.js'
import type { z, AnyZodObject } from 'zod'

type Validator<TValidated> = (input: any) => Promise<TValidated>

export function body<TValidated>(validator: Validator<TValidated>) {
  return async (ctx: Ctx) => {
    const body = await validator(ctx.req.body)
    return { ...ctx, body }
  }
}

export function params<TValidated>(validator: Validator<TValidated>) {
  return async (ctx: Ctx) => {
    const params = await validator(ctx.req.query)
    return { ...ctx, params }
  }
}

export function zodParams<TZodSchema extends AnyZodObject>(schema: TZodSchema) {
  return params(zodValidator(schema))
}

export function zodBody<TZodSchema extends AnyZodObject>(schema: TZodSchema) {
  return body(zodValidator(schema))
}

function zodValidator<TZodSchema extends AnyZodObject>(
  schema: TZodSchema,
): Validator<z.infer<TZodSchema>> {
  return async (input: any) => {
    const output = await schema.parseAsync(input)
    return output
  }
}
