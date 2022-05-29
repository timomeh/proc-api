import { expect, test } from 'vitest'
import { z } from 'zod'
import { createProzClient, createProzResolver, proz } from '../src'
import { createTestServer, fetch } from './lib/test-server'

const prozResolver = createProzResolver({
  items: proz.query(
    proz.params(
      z.object({
        status: z.union([z.literal('todo'), z.literal('done')]),
        limit: z.preprocess(
          (val: any) => (val ? parseInt(val) : undefined),
          z.number().max(5).nullable(),
        ),
      }),
    ),
    async (ctx) => {
      return [
        { id: 1, status: 'todo' as const },
        { id: 2, status: 'done' as const },
        { id: 3, status: 'todo' as const },
        { id: 4, status: 'todo' as const },
      ]
        .filter((item) => item.status === ctx.params.status)
        .splice(0, ctx.params.limit || Infinity)
    },
  ),
  createItem: proz.mutation(
    proz.pipe(proz.body(z.object({ priority: z.number().max(5) }))),
    async (ctx) => {
      return { id: 'id', name: 'new item', priority: ctx.body.priority }
    },
  ),
})

createTestServer(prozResolver)
const client = createProzClient<typeof prozResolver>({ fetch })

test('handles params in queries', async () => {
  expect(await client.query.items({ limit: 2, status: 'todo' })).toEqual([
    { id: 1, status: 'todo' },
    { id: 3, status: 'todo' },
  ])
})

test('handles failing param validation in queries', async () => {
  expect(await client.query.items({ limit: 6, status: 'todo' })).toMatchObject({
    error: 'ZodError',
    issues: [{ code: 'too_big' }],
  })
})

test('handles body in mutations', async () => {
  expect(await client.mutate.createItem({ priority: 5 })).toEqual({
    id: 'id',
    priority: 5,
    name: 'new item',
  })
})

test('handles failing body validation in mutations', async () => {
  expect(await client.mutate.createItem({ priority: 6 })).toMatchObject({
    error: 'ZodError',
    issues: [{ code: 'too_big' }],
  })
})
