import { expect, test } from 'vitest'
import { client } from './test-server'

test('calls a query with params and receives the correct value', async () => {
  expect(await client.query.items({ status: 'todo' })).toEqual([
    { id: 1, status: 'todo' },
    { id: 3, status: 'todo' },
  ])
})

test('calls a mutation with a body and receives the correct value', async () => {
  expect(await client.mutate.createItem({ id: 'qux' })).toEqual({
    id: 'qux',
    name: 'new item',
  })
})
