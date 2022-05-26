import { expect, test } from 'vitest'
import { client } from './test-server'

test('validates param with zod', async () => {
  expect(await client.query.zodItems({ limit: 2, status: 'todo' })).toEqual([
    { id: 1, status: 'todo' },
    { id: 3, status: 'todo' },
  ])
})

test('handles failing param validation with zod', async () => {
  // @ts-expect-error
  expect(await client.query.zodItems({ limit: 2, status: 2 })).toMatchObject({
    error: 'ZodError',
    issues: [{ code: 'invalid_union' }],
  })
})

test('validates body with zod', async () => {
  expect(await client.mutate.zodCreateItem({ id: 'qux' })).toEqual({
    id: 'qux',
    name: 'new item',
  })
})

test('handles failing body validation with zod', async () => {
  // @ts-expect-error
  expect(await client.mutate.zodCreateItem({ id: 'foo' })).toMatchObject({
    error: 'ZodError',
    issues: [{ code: 'invalid_union' }],
  })
})
