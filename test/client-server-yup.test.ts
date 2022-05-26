import { expect, test } from 'vitest'
import { client } from './test-server'

test('validates param with zod', async () => {
  expect(await client.query.yupItems({ status: 'todo', limit: 2 })).toEqual([
    { id: 1, status: 'todo' },
    { id: 3, status: 'todo' },
  ])
})

test('handles failing param validation with zod', async () => {
  // @ts-expect-error
  expect(await client.query.yupItems({ limit: 2, status: 2 })).toMatchObject({
    error: 'ValidationError',
    errors: ['status must be one of the following values: todo, done'],
  })
})

test('validates body with zod', async () => {
  expect(await client.mutate.yupCreateItem({ id: 'qux' })).toEqual({
    id: 'qux',
    name: 'new item',
  })
})

test('handles failing body validation with zod', async () => {
  expect(await client.mutate.yupCreateItem({ id: 'foo' })).toMatchObject({
    error: 'ValidationError',
    errors: ['id must be one of the following values: qux, baz'],
  })
})
