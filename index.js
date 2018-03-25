const GitHub = require('@octokit/rest')
const assert = require('assert')
const ellipsize = require('ellipsize')

function initDB (opts) {
  return new IssueDB(opts)
}

class IssueDB {
  constructor (opts = {}) {
    assert(opts.owner, 'owner is a required option')
    assert(opts.repo, 'repo is a required option')
    assert(opts.token, 'token is a required option')

    opts.github = GitHub()
    opts.github.authenticate({type: 'token', token: opts.token})

    Object.assign(this, opts)

    return this
  }

  async list () {
    // paginate for all open issues
    // https://github.com/octokit/rest.js/issues/688#issuecomment-355787784
    let result
    do {
      if (result) {
        result = await this.github.getNextPage(result)
      } else {
        result = await this.github.issues.getForRepo({
          owner: this.owner,
          repo: this.repo,
          state: 'open',
          per_page: 100
        })
      }
    } while (this.github.hasNextPage(result))

    return result.data.map(stripDownIssueObject)
  }

  async purge () {
    const issues = await this.list()

    for (const issue of issues) {
      await this.github.issues.edit({
        owner: this.owner,
        repo: this.repo,
        number: issue.number,
        state: 'closed'
      })
    }
  }

  async get (number) {
    const {data:issue} = await this.github.issues.get({
      owner: this.owner,
      repo: this.repo,
      number
    })
    return stripDownIssueObject(issue)
  }

  async put (input) {
    const title = typeof input === 'string'
      ? ellipsize(input)
      : ellipsize(String(input.title || input.name || input.id || 'untitled'))
    const body = fence(input)
    const {data} = await this.github.issues.create({
      owner: this.owner,
      repo: this.repo,
      title,
      body
    })

    return {
      number: data.number,
      title,
      body: input
    }
  }
}

function fence (input) {
  return [
    '```json',
    JSON.stringify(input, null, 2),
    '```'
  ].join('\n')
}

function unfence (input) {
  return JSON.parse(input.replace(/^```json/, '').replace(/```$/m, '').trim())
}

function stripDownIssueObject (issue) {
  return {
    number: issue.number,
    title: issue.title,
    body: unfence(issue.body)
  }
}
module.exports = initDB
