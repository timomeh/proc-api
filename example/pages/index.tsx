import type { NextPage } from 'next'
import * as React from 'react'
import { client } from '../lib/proc-api-client'

const Index: NextPage = () => {
  const [message, setMessage] = React.useState('...')

  return (
    <div>
      Proc says: {message}
      <br />
      <button
        onClick={async () => {
          const { message } = await client.query.helloWorld()
          setMessage(message)
        }}
      >
        Call Proc
      </button>
    </div>
  )
}

export default Index
