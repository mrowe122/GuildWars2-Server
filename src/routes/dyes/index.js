import express from 'express'
import fetch from 'node-fetch'
import { keyBy, map, assign } from 'lodash/fp'
import config from '../../config'
import { db } from '../../database'

const router = express.Router()

const checkErrors = response => {
  if (!response.ok) {
    throw response.status
  }
  return response.json()
}

export const mergeIds = (data, ids) => new Promise(resolve => {
  const _itemIds = keyBy('id')(ids)
  const merged = map(c => assign(c, { data: _itemIds[c.item] }))(data)
  resolve(merged)
})

router
  .get('/', request)

function request (req, res) {
  fetch(`${config.gwHost}/account/dyes`, { headers: { Authorization: `Bearer ${req.apiKey}` } })
    .then(checkErrors)
    .then(response => {
      db.dyes(response)
        .then(data => db.items(data.map(d => d.item)).then(itemData => mergeIds(data, itemData)))
        .then(data => res.send({ body: data }))
    })
    .catch(err => console.error(err))
}

export default router
