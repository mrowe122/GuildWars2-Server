import { keyBy, assign, flatMap, get, getOr, sum, includes } from 'lodash/fp'

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
  let defense = 0
  let Toughness = 0
  let upgrades = {}
  _equipment.filter(e =>
      e.slot !== 'HelmAquatic' &&
      e.slot !== 'WeaponA1' &&
      e.slot !== 'WeaponA2' &&
      e.slot !== 'WeaponB1' &&
      e.slot !== 'WeaponB2' &&
      e.slot !== 'WeaponAquaticA' &&
      e.slot !== 'WeaponAquaticB').map(e => {
    defense += get('data.details.defense')(e) || 0
    Toughness += sum(getOr([], 'data.details.infix_upgrade.attributes')(e).map(a => a.attribute === 'Toughness' && a.modifier))
    getOr([], 'upgrades')(e).map(u => {
      if (!upgrades[u.id]) {
        upgrades[u.id] = {
          count: 1,
          bonus: u.details.bonuses || []
        }
      } else {
        upgrades[u.id].count++
      }
    })
    Toughness += sum(flatMap(i =>
      getOr([], 'details.infix_upgrade.attributes')(i).map(a => a.attribute === 'Toughness' && a.modifier)
    )(getOr([], 'infusions')(e)))
  })
  for (let key in upgrades) {
    console.log(upgrades)
    for (let i = 0; i < upgrades[key].count; i++) {
      Toughness += includes('Toughness', upgrades[key].bonus[i]) ? parseInt(upgrades[key].bonus[i]) : 0
    }
  }

  console.log(upgrades)
  console.log('defense', defense)
  console.log('Toughness', Toughness)
  console.log(Toughness + defense + 1000)
  resolve(assign(data, { equipment: keyBy('slot')(_equipment) }))
})
