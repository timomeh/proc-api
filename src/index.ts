import { handler } from './handler.js'

export { createClient } from './client.js'
export { createServer } from './server.js'
export { handler } from './handler.js'
import { pipe } from './pipe.js'
import {
  body,
  params,
  zodBody,
  zodParams,
  yupBody,
  yupParams,
} from './validation.js'

export * from './types.js'

export const proc = {
  handler,
  pipe,
  body,
  params,
  zodParams,
  zodBody,
  yupParams,
  yupBody,
}
