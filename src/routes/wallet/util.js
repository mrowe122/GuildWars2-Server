import { keyBy, map, assign } from 'lodash/fp'

export const mergeIds = (data, ids) => new Promise(resolve => {
  const _currencyIds = keyBy('id')(ids)
  const merged = map(c => assign(c, { data: _currencyIds[c.id] }))(data)
  resolve(merged)
})
