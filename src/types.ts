import type { IncomingMessage, ServerResponse } from 'node:http'

export type Procs = {
  [procName: string]: (...args: any) => any | Promise<any>
}

export type CreatedServer = {
  procs: Procs
  handler: (req: IncomingMessage, res: ServerResponse) => any | Promise<any>
}
