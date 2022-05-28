import { expect, test } from 'vitest'
import { createClient, createServer, proc } from '../src'
import { createTestServer, fetch } from './lib/test-server'

const procServer = createServer({
  query: {
    items: proc.handler(
      proc.pipe((ctx) => ctx),
      async () => {
        return [
          { id: 1, status: 'todo' as const },
          { id: 2, status: 'done' as const },
          { id: 3, status: 'todo' as const },
          { id: 4, status: 'todo' as const },
        ]
      },
    ),
  },
  mutate: {
    createItem: proc.handler(
      proc.pipe((ctx) => ({ ...ctx, body: { id: ctx.req.body.id } })),
      async (ctx) => {
        return { id: ctx.body.id, name: 'new item' }
      },
    ),
  },
})

createTestServer(procServer)
const client = createClient<typeof procServer>({ fetch })

test('calls a query with params and receives the correct value', async () => {
  expect(await client.query.items()).toEqual([
    { id: 1, status: 'todo' },
    { id: 2, status: 'done' },
    { id: 3, status: 'todo' },
    { id: 4, status: 'todo' },
  ])
})

test('calls a mutation with a body and receives the correct value', async () => {
  expect(await client.mutate.createItem({ id: 'qux' })).toEqual({
    id: 'qux',
    name: 'new item',
  })
})
