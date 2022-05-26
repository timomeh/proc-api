import { exec } from 'node:child_process'
import util from 'node:util'
import { expect, test } from 'vitest'

const execAsync = util.promisify(exec)

test('server code does not leak into client bundle', async () => {
  let { stdout } = await execAsync(
    "grep -rnw 'example/.next/' -e 'Hello, World!'",
  )

  const lines = stdout
    .split('\n')
    .filter((line) => !line.includes('cache/webpack'))
    .filter((line) => line.length > 0)
    .map((line) => line.replace(/\s\s+/g, ' '))

  expect(lines).toEqual([
    `example/.next//server/pages/api/[...proc].js:75: message: "Hello, World!"`,
  ])
})
