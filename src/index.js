import express from 'express'
import routes from './routes'
import { port } from '../config'
const app = express()
app.use('/api', routes)

app.listen(port)
console.log(`Express router listening on port: ${port}`)
