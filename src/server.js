import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
import routes from './routes'
import config from './config'
const app = express()

const start = () => {
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.use('/api', routes)
  app.listen(config.port, () => {
    console.log(`Express router listening on port: ${config.port}`)
    if (!fs.existsSync('userDb')) {
      fs.mkdir('userDb', () => {
        fs.mkdir('userDb/users', () => {
          console.log('created users db')
        })
        fs.mkdir('userDb/sessions', () => {
          console.log('created sessions db')
        })
      })
    }
  })
}

export default start
