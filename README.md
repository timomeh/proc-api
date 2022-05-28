# proz

> proz is a TypeScript-powered HTTP RPC library for your own server and client,
> which empowers you to write typesafe client-server communication.

**This Library is currently a work in progress and not ready for production.**

proz allows you to write elegant API methods on your server, and generates you
an easy-to-use and fully typed API client – only using TypeScript and JavaScript
proxies, without any compilation steps or babel plugins. **Calling an API method
with proz looks like calling any other async JavaScript function.**

- It's tiny! Because proz' API client is a small JavaScript proxy, it's only
  250 Bytes (and ~150 Bytes gzipped)!
- Makes heavy use of TypeScript's type inference, so you don't have to write
  types at all.
- Groups your API methods into Queries and Mutations, which you might already
  know from GraphQL or react-query.

But why not GraphQL or a RESTful API? Because for developing your own app, you
don't need it. Just use convenient Remote Procedure Calls (PRC).

**Info:** This package is native ESM.

## Example

```tsx
import { proz } from 'proz'

// Define Mutations

// Use pipe() to create middlewares for your API methods.
const addTodoCtx = proz.pipe(
  // use your own authentication middlewares
  async (ctx) => {
    const user = await db.user.findById(ctx.req.cookies['user_id'])
    return { ...ctx, user }
  },
  // Validate and sanitize the request's body with yup, zod, ...
  proz.yupBody({ id: yup.string().required }) 
)

// Use handler() to create your API method.
const addTodo = proz.handler(addTodoCtx, async (ctx) => {
  // ctx.body is validated!
  const todo = await db.todo.create({
    ...ctx.body,
    userId: ctx.user.id // ctx is typesafe from your middlewares
  })
  return todo
)

// Define Queries

const todosCtx = proz.pipe(
  authentication,
  // Validate and sanitize the request's query params.
  proz.yupParams({ status: yup.string().oneOf(['todo', 'done']) })
)

const todos = proz.handler(todosCtx, async (ctx) => {
  const todos = await db.todo.getAll({
    where: { status: ctx.params.status }
  })
  return todos
})

// Create your proz server and use your queries and mutations.
// Example for Next.js: api/rpc/[...proz].ts

const prozServer = proz.createServer({
  query: {
    todos
  },
  mutate: {
    addTodo
  }
})

export type ProzServer = typeof prozServer

export default async (req, res) => {
  const data = prozServer.handle(req, res)
  res.json(data)
}

// lib/api-client.ts

import type { ProzServer } from '...'

// Create your api client and feed it with the type of the prozServer.
const api = proz.createClient<ProzServer>({
  fetch: ({ proc, method, body, params }) => {
    // Use your favorite HTTP library.
    return ky(`/api/${proc}`, {
      method,
      json: body,
      searchParams: params
    }).json()
  }
})

// client/ui-component.ts

// Simply use your API client inside your UI.
// The responses and query params are automatically fully typed,
// using the schemas and return type from your API handlers.
const todos = await api.query.todos({ status: 'todo' })
const doneTodos = await api.query.todos({ status: 'done' })

async function handleAddClick() {
  const newTodo = await api.mutate.addTodo({
    name: 'Buy Milk' // body is fully typed using your TodoSchema
  })

  console.log(newTodo) // Of course, newTodo is fully typed!
}

<button onClick={handleAddClick}>
  Add Todo
</button>
```