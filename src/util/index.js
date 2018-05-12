import { keyBy, assign, flatMap } from 'lodash/fp'

export const mergeEquipment = (data, ids) => new Promise(resolve => {
  const itemIdKey = keyBy('id')(ids[0].body)
  const skinIdKey = keyBy('id')(ids[1].body)
  const equipment = flatMap(({ infusions = [], upgrades = [], skin, ...e }) => assign(
    e, {
      data: itemIdKey[e.id],
      infusions: infusions.map(i => itemIdKey[i]),
      upgrades: upgrades.map(u => itemIdKey[u]),
      skin: skinIdKey[skin]
    }
  ))(data.equipment)
  resolve(assign(data, { equipment: keyBy('slot')(equipment) }))
})
