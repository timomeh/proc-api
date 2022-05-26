import { createServer, proc } from '../../dist/index'

const helloWorld = proc.handler(
  proc.pipe((ctx) => ctx),
  async (ctx) => {
    return {
      message: 'Hello, World!',
    }
  },
)

export const api = createServer({
  query: {
    helloWorld,
  },
  mutate: {},
})
