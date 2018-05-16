import { keyBy, assign, flatMap } from 'lodash/fp'

export const mergeEquipment = (data, ids) => new Promise(resolve => {
  const _itemIdKey = keyBy('id')(ids[0].body)
  const _skinIdKey = keyBy('id')(ids[1].body)
  const _equipment = flatMap(({ infusions = [], upgrades = [], skin = null, ...e }) => assign(
    e, {
      data: _itemIdKey[e.id],
      infusions: infusions.map(i => _itemIdKey[i]),
      upgrades: upgrades.map(u => _itemIdKey[u]),
      skin: _skinIdKey[skin]
    }
  ))(data.equipment)
  resolve(assign(data, { equipment: keyBy('slot')(_equipment) }))
})
