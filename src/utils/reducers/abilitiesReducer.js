export default (state, action) => {
    const newState = JSON.parse(JSON.stringify(state))
    const payload = action.payload

    switch(action.type) {
        case "GLOBAL_COOLDOWN_START":
            newState.globalCooldown = payload.gcd
            newState.globalCooldownStartTime = payload.time
            break
        case "GLOBAL_COOLDOWN_END":
            newState.globalCooldownStartTime = 0
            break
        case "ABILITY_CAST_SUCCESS":
            var {name} = payload
            newState.cooldowns[name].castStartTime = 0
            newState.cooldowns[name].castEndTime = 0

            if(newState.casting) {
                newState.cooldowns[newState.casting.name].castStartTime = 0
                newState.cooldowns[newState.casting.name].castEndTime = 0
                delete newState.casting
            }
            break
        case "ABILITY_COOLDOWN_START":
            var {name, time} = payload
            newState.cooldowns[name].startTime = time
            break
        case "ABILITY_COOLDOWN_END":
            var {name} = payload
            newState.cooldowns[name].startTime = 0
            break
        case "ABILITY_CAST_START":
            var {name, displayName, time, duration} = payload
            newState.cooldowns[name].castStartTime = time
            newState.cooldowns[name].castEndTime = time + duration
            if(newState.casting) {
                newState.cooldowns[newState.casting.name].castStartTime = 0
                newState.cooldowns[newState.casting.name].castEndTime = 0
            }
            newState.casting = {
                duration,
                name,
                displayName,
                direction: 1,
                time
            }
            break
        case "ABILITY_CHANNEL_START":
            var {name, displayName, time, duration, baseChannelTime, currentTicks} = payload
            var ability = newState.cooldowns[name]

            newState.cooldowns[name] = {
                ...ability,
                castStartTime: time,
                castEndTime: time + duration,
                baseChannelTime,
                currentTicks
            }

            if(newState.casting && name !== newState.casting.name) {
                newState.cooldowns[newState.casting.name].castStartTime = 0
                newState.cooldowns[newState.casting.name].castEndTime = 0
            }
            newState.casting = {
                duration,
                name,
                displayName,
                direction: 0,
                time
            }
            break
        case "ABILITY_CHANNEL_UPDATE":
            var {name} = payload
            newState.cooldowns[name].currentTicks--
            break
        case "ABILITY_CHANNEL_END":
            var {name} = payload
            var ability = newState.cooldowns[name]

            newState.cooldowns[name] = {
                ...ability,
                castStartTime: 0,
                castEndTime: 0,
                currentTicks: 0
            }
            if(newState.casting && name === newState.casting.name) delete newState.casting
            break
    }

    return newState

}