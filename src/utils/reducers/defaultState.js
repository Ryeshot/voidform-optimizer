import defaultAbilities from "../../lib/abilities"
import defaultEffects from "../../lib/effects"

const inactiveAbilities = ["void-eruption", "devouring-plague"]
const cooldowns = Object.keys(defaultAbilities).reduce((obj, a) => {
    obj[a] = {}
    return obj
}, {})

// const effects = Object.keys(defaultEffects).reduce((obj, e) => {
//   obj[e] = {
//     active: false
//   }
//   return obj
// })

export default {
    resource: 0,
    auras: {
      stats: {
        haste: 0
      },
      voidform: {
        active: false,
        stacks: 0,
        haste: 0,
        paused: false,
      },
      lingeringInsanity: {
        active: false,
        stacks: 0,
        haste: 0
      },
      "shadow-word-pain": {
        active: false
      },
      "vampiric-touch": {
        active: false
      },
      "devouring-plague": {
        active: false
      },
      "shadowfiend": {
        active: false
      },
      "power-infusion": {
        active: false,
        haste: 0
      },
      "fae-blessings": {
        active: false
      },
      "bloodlust": {
        active: false,
        haste: 0
      }
    },
    abilities: {
      cooldowns,
      globalCooldown: 0
    },
    effects: defaultEffects
  }