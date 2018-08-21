const { keyBy, assign, assignAll, flatMap, map, mapValues } = require('lodash/fp')

const parseData = data => ids => Promise.all([
  mergeIds(data, [ids[0], ids[1]]),
  guildEmblem(ids[2]),
  mergeSpecialization(data.specializations, ids[3])
]).then(parsedData => assignAll([data, ...parsedData]))

const mergeIds = (data, ids) => new Promise(resolve => {
  const _itemIdKey = keyBy('id')(ids[0])
  const _skinIdKey = keyBy('id')(ids[1])
  const _equipment = flatMap(({ infusions = [], upgrades = [], skin = null, ...e }) => assign(
    e, {
      data: _itemIdKey[e.id],
      infusions: infusions.map(i => _itemIdKey[i]),
      upgrades: upgrades.map(u => _itemIdKey[u]),
      skin: _skinIdKey[skin]
    }
  ))(data.equipment)
  const _inventory = flatMap(
    ({ inventory = [], ...e }) => assign(
      e, {
        data: _itemIdKey[e.id],
        inventory: inventory.map(i => i && assign(i, { data: _itemIdKey[i.id] }))
      }
    )
  )(data.bags)
  resolve({ equipment: keyBy('slot')(_equipment), bags: _inventory })
})

const guildEmblem = data => new Promise(resolve => resolve({ guild: data ? data : { name: 'Not in a Guild' } }))

const mergeSpecialization = (data, ids) => new Promise(resolve => {
  const _itemIdKey = keyBy('id')(ids)
  const _specialization = mapValues(map(s => s ? assign(s, { data: _itemIdKey[s.id] }) : null))(data)
  resolve({ specializations: _specialization })
})

module.exports = {
  parseData
}