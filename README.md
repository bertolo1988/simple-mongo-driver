# simple-mongo-driver

A simpler facade for mongodb node.js driver

[![npm version](https://badge.fury.io/js/simple-mongo-driver.svg)](https://badge.fury.io/js/simple-mongo-driver)

[![Build Status](https://travis-ci.org/bertolo1988/simple-mongo-driver.svg?branch=master)](https://travis-ci.org/bertolo1988/simple-mongo-driver)

## Install

`npm i --save simple-mongo-driver`

## How to use

```javascript
const Mongo = require('simple-mongo-driver')
let db = await Mongo.connect({ uri: 'mongodb://localhost:27017', name: 'test-database' })
let collection = db.collection('test-collection')
await collection.insertOne({ nice: 1 })
```

Check [here]('./test/Mongo.js) for more.

## API

```
  isValidObjectId
  getDatabase
  isConnected,
  connect
  disconnect
  dropDatabase
```

## Linting

`npm run lint`

## Testing

`npm run test`

## Contributing

Contributions will be highly appreciated.

Feel free to open any issues on any related matter.

## LICENSE

Code released under the [MIT](./LICENSE).
