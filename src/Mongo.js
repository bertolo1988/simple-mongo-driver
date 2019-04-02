const debug = require('debug')('simple-mongo-driver')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID

var database, client, config, environment

function onReconnect() {
  debug('Mongo successfully reconnected!')
}

function onClose() {
  debug('Mongo connection closed!')
}

function onConnect() {
  debug('Mongo successfully connected at %O!', config.uri)
}

function isConnected() {
  return !!client && !!client.topology && client.topology.isConnected()
}

function isValidObjectId(id) {
  return ObjectID.isValid(id)
}

function getDatabase() {
  return database
}

async function connect(inputConfig, inputEnvironment) {
  if (isConnected()) {
    return database
  }
  environment = inputEnvironment
  config = inputConfig
  debug('Connecting to database at %O...', config.uri)
  client = await MongoClient.connect(config.uri, { useNewUrlParser: true })
  onConnect()
  client.on('close', onClose)
  client.on('reconnect', onReconnect)
  database = client.db(config.name)
  return database
}

async function disconnect() {
  if (isConnected()) {
    debug('Disconnecting from database...')
    await client.close()
  }
}

async function dropDatabase() {
  if (environment.toLowerCase() != 'production' && environment.toLowerCase() != 'prod') {
    debug('WARNING! Dropping database!')
    return database.dropDatabase()
  }
}

module.exports = {
  isValidObjectId,
  getDatabase,
  isConnected,
  connect,
  disconnect,
  dropDatabase
}
