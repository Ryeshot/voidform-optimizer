import defaultAbilities from "../../lib/abilities"

const inactiveAbilities = ["void-eruption", "devouring-plague"]
const cooldowns = Object.keys(defaultAbilities).reduce((obj, a) => {
    obj[a] = { unusable: inactiveAbilities.includes(a)}
    return obj
}, {})

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
      "bloodlust": {
        active: false,
        haste: 0
      }
    },
    abilities: {
      cooldowns,
      globalCooldown: 0
    }
  }