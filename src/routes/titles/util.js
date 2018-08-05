const { keyBy, map, assign } = require('lodash/fp')

const mergeIds = (data, ids) => new Promise(resolve => {
  const _titles = keyBy('id')(ids)
  const merged = map(c => assign(c, { achievements: map(a => _titles[a])(c.achievements) }))(data)
  resolve(merged)
})

module.exports = {
  mergeIds
}