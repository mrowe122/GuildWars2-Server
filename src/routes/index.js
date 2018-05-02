import express from 'express'
import character from './characters'

const router = express.Router()

router.use(enableCors)

router.use('/characters', character)

export default router

function enableCors (req, res, next) {
  res.set('Cache-Control', 'no-store, must-revalidate, no-cache')
  res.set('Pragma', 'no-cache')
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET')
  next()
}
