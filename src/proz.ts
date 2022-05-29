import { pipe } from './pipe.js'
import { body, params } from './schema.js'
import { query, mutation } from './handlers.js'

export const proz = {
  query,
  mutation,
  pipe,
  params,
  body,
}
