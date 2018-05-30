import express from 'express'
import character from './characters'
import authentication from './authentication'
import tokeninfo from './tokeninfo'

const router = express.Router()

const enableCors = (req, res, next) => {
  res.set('Cache-Control', 'no-store, must-revalidate, no-cache')
  res.set('Pragma', 'no-cache')
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, POST')
  next()
}

router.use(enableCors)

router.use('/characters', character)
// TODO: The entirety of this authentication is temporary
router.use('/authenticate', authentication)
router.use('/tokeninfo', tokeninfo)

export default router
