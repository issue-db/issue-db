require('dotenv-safe').load()
require('make-promises-safe')

const db = require('.')({
  owner: 'issue-db',
  repo: 'sandbox',
  token: process.env.GH_TOKEN
})

test('purge', async () => {
  await db.purge()
  const issues = await db.list()
  expect(issues.length).toBe(0)
})

test('put (with default title)', async () => {
  const issue = await db.put({some: 'data'})
  expect(typeof issue.number).toBe('number')
  expect(issue.title).toBe('untitled')
  expect(issue.body).toEqual({some: 'data'})
})

test('put (with inferred title)', async () => {
  const issue = await db.put({title: 'the date is ' + new Date()})
  expect(typeof issue.number).toBe('number')
  expect(issue.title).toMatch(/^the date is/)
  expect(issue.body).toHaveProperty('title')
})

test('put and get', async () => {
  const ingoing = await db.put({hello: 'world'})
  const outgoing = await db.get(ingoing.number)
  expect(outgoing.number).toBe(ingoing.number)
  expect(outgoing.title).toBe(ingoing.title)
  expect(outgoing.body.hello).toBe('world')
})

test('list', async () => {
  const issues = await db.list()
  expect(Array.isArray(issues)).toBe(true)
  expect(issues.length).toBe(3)
})
