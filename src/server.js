const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const admin = require('firebase-admin')
const routes = require('./routes')
const config = require('./config')

const app = express()

const start = () => {
  admin.initializeApp({
    credential: admin.credential.cert(config.firebaseCredentials),
    databaseURL: process.env.DATABASE_URL
  })

  app.use(compression())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.use('/api', routes)
  app.listen(config.port, () => {
    console.log(`Express router listening on port: ${config.port}`)
  })
}

module.exports = start