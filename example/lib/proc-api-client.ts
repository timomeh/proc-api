import { createClient } from '../../dist/client'
import { api } from './proc-api-server'

export const client = createClient<typeof api>({
  fetch: (procName) =>
    fetch(`http://locahost:3000/api/${procName}`).then((res) => res.json()),
})
