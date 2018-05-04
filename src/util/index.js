import { keyBy, assign, flatMap } from 'lodash/fp'

export const mergeEquipmentIds = (data, ids) => new Promise(resolve => {
  const idKey = keyBy('id')(ids)
  const equipment = flatMap(({ infusions = [], upgrades = [], ...e }) => assign(
    e, { data: idKey[e.id], infusions: infusions.map(i => idKey[i]), upgrades: upgrades.map(u => idKey[u]) }
  ))(data.equipment)
  resolve(assign(data, { equipment: equipment }))
})
