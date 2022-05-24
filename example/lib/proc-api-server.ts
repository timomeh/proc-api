import { createServer } from '../../dist/server'
import { helloWorld } from './procs/helloWorld'

export const api = createServer(
  {
    helloWorld,
  },
  {
    prefix: '/api/',
  },
)
