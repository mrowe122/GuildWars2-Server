import express from 'express'
import bodyParser from 'body-parser'
import * as admin from 'firebase-admin'
import routes from './routes'
import config from './config'
const app = express()

const start = () => {
  admin.initializeApp({
    credential: admin.credential.cert(config.firebaseCredentials),
    databaseURL: process.env.DATABASE_URL
  })

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.use('/api', routes)
  app.listen(config.port, () => {
    console.log(`Express router listening on port: ${config.port}`)
  })
}

export default start
