import { get, getOr, includes } from 'lodash/fp'
import { armorTypes, weaponTypes } from './constants'

// BoonDuration - Concentration
// ConditionDamage – Condition Damage
// ConditionDuration - Expertise
// CritDamage – Ferocity
// Healing – Healing Power
// Power – Power
// Precision – Precision
// Toughness – Toughness
// Vitality – Vitality

export const parseAttributes = item => {
  const att = {}
  const _runes = {}
  const _sigils = []
  item.filter(e =>
    e.slot !== 'HelmAquatic' &&
    // e.slot !== 'WeaponA1' &&
    // e.slot !== 'WeaponA2' &&
    e.slot !== 'WeaponB1' &&
    e.slot !== 'WeaponB2' &&
    e.slot !== 'WeaponAquaticA' &&
    e.slot !== 'WeaponAquaticB').map(i => {

    // Defense
    att.Defense = (att.Defense || 0) + (get('data.details.defense')(i) || 0)

    // attributes
    getOr([], 'data.details.infix_upgrade.attributes')(i).map(a => {
      att[a.attribute] = (att[a.attribute] || 0) + a.modifier
    })

    // infusions
    getOr([], 'infusions')(i).map(i =>
      getOr([], 'details.infix_upgrade.attributes')(i).map(a => {
        att[a.attribute] = (att[a.attribute] || 0) + a.modifier
      })
    )

    // upgrades
    if (includes(i.slot, armorTypes)) {
      getOr([], 'upgrades')(i).map(u => {
        if (!_runes[u.id]) {
          _runes[u.id] = {
            count: 1,
            bonus: getOr([], 'details.bonuses')(u).slice(0, 5) || []
          }
        } else {
          _runes[u.id].count++
        }
      })
    }

    // upgrades
    if (includes(i.slot, weaponTypes)) {
      getOr([], 'upgrades')(i).map(u => {
        _sigils.push(u.details.infix_upgrade.buff.description)
      })
    }
  })
  for (let key in _runes) {
    for (let i = 0; i < _runes[key].count; i++) {
      if (_runes[key].bonus[i]) {
        const string = _runes[key].bonus[i].split(' ')
        att[string[1]] = (att[string[1]] || 0) + parseInt(string[0])
      }
    }
  }

  _sigils.map(sigil => {
    console.log(sigil.split(/([A-Z])\w+/gi))
  })

  att.Power += 1000
  att.Toughness += 1000
  att.Precision += 1000
  att.Vitality += 1000
  att.Armor = att.Toughness + att.Defense
  att.Ferocity = att.CritDamage
  att.CriticalChance = (att.Precision - 895) / 21

  delete att.CritDamage
  delete att.Defense

  return att
}
