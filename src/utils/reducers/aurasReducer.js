const handleAuraPandemic = (aura, now) => {
    const endTime = aura.startTime + aura.maxDuration
    const baseDuration = aura.baseDuration
    const remaining = endTime - now
    const pandemicDuration = Math.min(.3 * baseDuration, remaining)

    aura.maxDuration = baseDuration + pandemicDuration
    aura.startTime = now
  }

export default (state, action) => {
    const newState = JSON.parse(JSON.stringify(state))
    const payload = action.payload
    const voidform = newState.voidform
    const lingeringInsanity = newState.lingeringInsanity

    switch(action.type) {
      case "HASTE_SET":
        var {source, haste} = payload
        newState[source].haste = haste
        break
      case "HASTE_UPDATE":
        var {source, haste} = payload
        newState[source].haste += haste
        break
      case "HASTE_RESET":
        var {source} = payload
        newState[source].haste = 0
        break
      case "VOIDFORM_UPDATE":
        voidform.stacks++
        voidform.haste += payload
        break;
      case "VOIDFORM_START":
        voidform.active = true
        voidform.stacks = 1
        break;
      case "VOIDFORM_END":
        var {time, startingHaste} = payload
        lingeringInsanity.active = true
        lingeringInsanity.stacks = voidform.stacks
        lingeringInsanity.haste = Math.round((voidform.haste - startingHaste)*1000)/1000
        lingeringInsanity.startTime = time
        voidform.stacks = 0
        voidform.haste = 0
        newState.abilities["void-eruption"].unusable = true
        break;
      case "LINGERING_INSANITY_START":
        var {haste, stacks} = payload
        lingeringInsanity.haste = haste
        lingeringInsanity.stacks = stacks
        break;
      case "LINGERING_INSANITY_UPDATE":
        lingeringInsanity.haste += payload
        lingeringInsanity.stacks--
        if(lingeringInsanity.haste <= 0) lingeringInsanity.haste = 0
        break;
      case "LINGERING_INSANITY_END":
        lingeringInsanity.active = false
        lingeringInsanity.stacks = 0
        lingeringInsanity.haste = 0
        lingeringInsanity.startTime = 0
        break;
      case "INSANITY_DRAIN_PAUSE_START":
        voidform.paused = true
        break
      case "INSANITY_DRAIN_PAUSE_END":
        voidform.paused = false
        break
      case "AURA_START":
        var {name, time} = payload
        var aura = newState[name]

        aura.active ? handleAuraPandemic(aura, time) : aura.active = true
        break
      case "AURA_BEGIN":
        var {name, time, duration} = payload
        newState[name].startTime = time
        newState[name].maxDuration = duration
        newState[name].baseDuration = duration
        break
      case "AURA_REFRESH":
        var {name, time} = payload
        newState[name].startTime = time
        break
      case "AURA_END":
        var {name} = payload
        newState[name].active = false
        newState[name].startTime = 0
        break
    }

    return newState
  }