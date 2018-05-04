import express from 'express'
import bodyParser from 'body-parser'
import routes from './routes'
import config from './config'
const app = express()

const start = () => {
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.use('/api', routes)
  app.listen(config.port, () => {
    console.log(`Express router listening on port: ${config.port}`)
  })
}

export default start
