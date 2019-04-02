require('should')
const _ = require('lodash')
const Mongo = require('../src/Mongo')

const TEST_CONFIG = {
  environment: 'test',
  database: {
    uri: 'mongodb://localhost:27017',
    name: 'test-database'
  }
}

function isDatabase(db) {
  let mongoDbKeys = [
    'domain',
    '_events',
    '_eventsCount',
    '_maxListeners',
    's',
    'serverConfig',
    'bufferMaxEntries',
    'databaseName'
  ]
  let dbKeys = Object.keys(db)
  return _.isEqual(mongoDbKeys.sort(), dbKeys.sort())
}

describe('Mongo', () => {
  it('isConnected should give false if not connected', async () => {
    Mongo.isConnected().should.be.false()
  })

  it('should detect proper validate good ObjectId', () => {
    Mongo.isValidObjectId('53fbf4615c3b9f41c381b6a3').should.be.true()
  })

  it('should detect invalid ObjectId', () => {
    Mongo.isValidObjectId('53fbf461$c3b9f41c381b6a3').should.be.false()
  })

  it('should connect and disconnect to local Mongo', async () => {
    Mongo.isConnected().should.be.false()
    let db = await Mongo.connect(TEST_CONFIG.database, TEST_CONFIG.environment)
    isDatabase(db).should.be.true()
    isDatabase(Mongo.getDatabase()).should.be.true()
    Mongo.isConnected().should.be.true()
    await Mongo.disconnect()
    Mongo.isConnected().should.be.false()
  })

  it('should succesfully drop database and check that is empty', async () => {
    Mongo.isConnected().should.be.false()
    let db = await Mongo.connect(TEST_CONFIG.database, TEST_CONFIG.environment)
    isDatabase(db).should.be.true()
    Mongo.isConnected().should.be.true()
    let collection = db.collection('test-collection')
    await collection.insertOne({ a: 1 })
    let findResult = await collection.findOne({ a: 1 })
    Mongo.isValidObjectId(findResult._id).should.be.true()
    findResult.a.should.be.eql(1)
    await Mongo.dropDatabase()
    Mongo.isConnected().should.be.true()
    let emptyFindResult = await collection.findOne({ a: 1 })
    should.not.exist(emptyFindResult)
    await Mongo.disconnect()
    Mongo.isConnected().should.be.false()
  })
})
