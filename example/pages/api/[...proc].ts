import type { NextApiRequest, NextApiResponse } from 'next'
import { api } from '../../lib/proc-api-server'

const procHandler = api.createHandler({ prefix: '/api/' })

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await procHandler(req, res)
    res.status(200).json(data)
  } catch (error: any) {
    res.json({
      message: error.message,
      status: error.status,
      stack: error.stack,
    })
  }
}

export default handler
