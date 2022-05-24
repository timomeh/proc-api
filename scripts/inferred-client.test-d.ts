import { expectType } from 'tsd'
import { createClient } from './src/client.js'
import { createServer } from './src/server.js'

const api = createServer(
  {
    listAsyncNumbers: async () => [1, 2, 3],
    listSyncNumbers: () => [1, 2, 3],
    returnAsyncConstFoo: () => 'foo' as const,
    returnSyncConstFoo: () => 'foo' as const,
  },
  {},
)

const client = createClient<typeof api>({
  fetch: () => Promise.resolve(),
})

expectType<Promise<number[]>>(client.listAsyncNumbers())
expectType<Promise<number[]>>(client.listSyncNumbers())
expectType<Promise<'foo'>>(client.returnAsyncConstFoo())
expectType<Promise<'foo'>>(client.returnSyncConstFoo())
