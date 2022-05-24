import type { NextPage } from 'next'
import * as React from 'react'
import { client } from '../lib/proc-api-client'

const Index: NextPage = () => {
  const [message, setMessage] = React.useState('...')

  React.useEffect(() => {
    client.helloWorld().then(({ message }) => setMessage(message))
  }, [])

  return <div>Proc says: {message}</div>
}

export default Index
