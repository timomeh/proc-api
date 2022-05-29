import { expect, test } from 'vitest'
import { createProzClient, createProzResolver, proz } from '../src'
import { createTestServer, fetch } from './lib/test-server'

const prozResolver = createProzResolver({
  foo: proz.query(
    proz.pipe((ctx) => ctx),
    async () => 'bar',
  ),
  items: proz.query(
    proz.pipe((ctx) => ctx),
    async () => {
      return [
        { id: 1, status: 'todo' as const },
        { id: 2, status: 'done' as const },
        { id: 3, status: 'todo' as const },
        { id: 4, status: 'todo' as const },
      ]
    },
  ),
  createItem: proz.mutation(
    proz.pipe((ctx) => ({ ...ctx, body: { id: ctx.req.body.id } })),
    async (ctx) => {
      return { id: ctx.body.id, name: 'new item' }
    },
  ),
  createFoo: proz.mutation(
    proz.pipe((ctx) => ctx),
    async () => 'foo',
  ),
})

createTestServer(prozResolver)
const client = createProzClient<typeof prozResolver>({ fetch })

test('calls a query with params and receives the correct value', async () => {
  expect(await client.query.foo()).toEqual('bar')
  expect(await client.query.items()).toEqual([
    { id: 1, status: 'todo' },
    { id: 2, status: 'done' },
    { id: 3, status: 'todo' },
    { id: 4, status: 'todo' },
  ])
})

test('calls a mutation with a body and receives the correct value', async () => {
  expect(await client.mutate.createFoo()).toEqual('foo')
  expect(await client.mutate.createItem({ id: 'qux' })).toEqual({
    id: 'qux',
    name: 'new item',
  })
})
