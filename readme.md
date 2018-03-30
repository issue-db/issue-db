# issue-db 

☁️ Use GitHub Issues as a JSON datastore

## Installation

```sh
npm install issue-db --save
```

## Usage

```js
const db = require('issue-db')({
  owner: 'some',
  repo: 'repo',
  token: process.env.GH_TOKEN
})
```

## API

All methods are async.

- [`db.put(object)`](#dbputobject)
- [`db.get(number)`](#dbgetnumber)
- [`db.list()`](#dblist)
- [`db.purge()`](#dbpurge)

### `db.put(object)`

- `object` - Any JSON-serializable input, like a String, Number, or Object.

Returns an object with the following properties:

- `number` - The id of the generate GitHub issue.
- `title` - The title of the issue. If `object` has a any of the following properties, they'll be used as the title: `title`, `name`, or `id`. Otherwise, the default title is `untitled`
- `body` - Your input object.

### `db.get(number)`

Retrieve a record from the database.

- `number` Number - A GitHub issue id.

Returns an object with the following properties:

- `number` - The unique id of the generated GitHub issue.
- `title` - The title of the issue. If `object` has a any of the following properties, they'll be used as the title: `title`, `name`, or `id`. Otherwise, the default title is `untitled`
- `body` - Your input object.

### `db.list()`

Returns an array of every record with a `state` of `open`

### `db.purge()`

Sets the `state` of all `open` issues to `closed`, effectively deleting the 
contents of your entire database. Use with caution!

## Tests

```sh
npm install
npm test
```

## Dependencies

- [@octokit/rest](https://github.com/octokit/rest.js): GitHub REST API client for Node.js
- [ellipsize](https://github.com/mvhenten/ellipsize): Ellipsizes a string at the nearest whitespace character near the end of allowed length

## Dev Dependencies

- [dotenv-safe](https://github.com/rolodato/dotenv-safe): Load environment variables from .env and ensure they are defined
- [jest](https://github.com/facebook/jest): Delightful JavaScript Testing.
- [make-promises-safe](https://github.com/mcollina/make-promises-safe): Crash or abort if you get an unhandledRejection
- [standard](https://github.com/standard/standard): JavaScript Standard Style
- [standard-markdown](https://github.com/zeke/standard-markdown): Test your Markdown files for Standard JavaScript Style™


## License

MIT
