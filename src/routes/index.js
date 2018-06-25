import express from 'express'
import character from './characters'
import tokeninfo from './tokeninfo'
import permissions from './permissions'
import { checkToken, getApiKey } from '../lib'

const router = express.Router()

const enableCors = (req, res, next) => {
  res.set('Cache-Control', 'no-store, must-revalidate, no-cache')
  res.set('Pragma', 'no-cache')
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, POST')
  next()
}

router
  .use(enableCors)
  .use(checkToken)
  .use(getApiKey)
  .use('/characters', character)
  .use('/tokeninfo', tokeninfo)
  .use('/permissions', permissions)

export default router
