import ky from 'ky'
import { createClient } from '../../dist/client'
import { api } from './proc-api-server'

export const client = createClient<typeof api>({
  fetch: ({ proc, method, body, params }) =>
    ky(`http://localhost:3000/api/${proc}`, {
      method,
      json: body,
      searchParams: params,
    }).json(),
})
