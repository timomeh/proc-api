import type { NextApiRequest, NextApiResponse } from 'next'
import { api } from '../../lib/proc-api-server'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const data = await api.handler({ req, res })
  res.json(data)
}
