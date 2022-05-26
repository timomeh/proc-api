import { Ctx } from './types.js'
import type { z, AnyZodObject } from 'zod'
import type {
  InferType as YupInferType,
  AnyObjectSchema as AnyYupObjectSchema,
} from 'yup'

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

function zodValidator<TZodSchema extends AnyZodObject>(
  schema: TZodSchema,
): Validator<z.infer<TZodSchema>> {
  return async (input: any) => {
    const output = await schema.parseAsync(input)
    return output
  }
}

export function zodParams<TZodSchema extends AnyZodObject>(schema: TZodSchema) {
  return params(zodValidator(schema))
}

export function zodBody<TZodSchema extends AnyZodObject>(schema: TZodSchema) {
  return body(zodValidator(schema))
}

function yupValidator<TYupSchema extends AnyYupObjectSchema>(
  schema: TYupSchema,
): Validator<YupInferType<TYupSchema>> {
  return async (input: any) => {
    const output = await schema.validate(input)
    return output
  }
}

export function yupParams<TYupSchema extends AnyYupObjectSchema>(
  schema: TYupSchema,
) {
  return params(yupValidator(schema))
}

export function yupBody<TYupSchema extends AnyYupObjectSchema>(
  schema: TYupSchema,
) {
  return body(yupValidator(schema))
}
