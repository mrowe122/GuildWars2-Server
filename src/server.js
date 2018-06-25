import express from 'express'
import bodyParser from 'body-parser'
import * as admin from 'firebase-admin'
import credentials from '../serviceAccountKey.json'
import routes from './routes'
import config from './config'
const app = express()

const start = () => {
  admin.initializeApp({
    credential: admin.credential.cert(credentials),
    databaseURL: 'https://gw2tracker-d615c.firebaseio.com'
  })

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.use('/api', routes)
  app.listen(config.port, () => {
    console.log(`Express router listening on port: ${config.port}`)
  })
}

export default start
