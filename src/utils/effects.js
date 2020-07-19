const effectTargets = {
    "void-bolt-cooldown-reset": ["void-bolt"],
    "void-bolt-cooldown-reduce-fae-blessings": ["fae-blessings"],
    "void-bolt-cooldown-reduce-shadowfiend": ["shadowfiend"]
}

const effectTriggered = (chance) => Date.now() % 100 < (chance * 100)

export default {
    "void-bolt-cooldown-reset": {
        trigger: ({events, state}) => {
            const {effects, effectSettings} = state
            if(!effectSettings) return events
            const name = "void-bolt-cooldown-reset"
            const targets = effectTargets[name]
            const {chance} = effectSettings[name]

            if(!effects[name].active) return events
            
            const triggered = effectTriggered(chance)

            if(!triggered) return events

            const type = "ABILITY_COOLDOWN_END"
            const effectEvents = targets.map(name => ({
                type,
                payload: { name }
            }))

            return [...events, ...effectEvents]
        }
    },
    "void-bolt-cooldown-reduce-fae-blessings": {
        trigger: ({events, state}) => {
            const {effects, effectSettings, auras, abilities} = state
            if(!effectSettings) return events
            const name = "void-bolt-cooldown-reduce-fae-blessing"
            const targets = effectTargets[name]
            const {chance, effectTime} = effectSettings[name]

            if(!effects[name].active) return events
            if(!auras["fae-blessings"].active) return events

            const triggered = effectTriggered(chance)

            if(!triggered) return events

            const type = "ABILITY_COOLDOWN_START"
            const effectEvents = targets.map(name => {
                const ability = abilities.cooldowns[name]
                const time = ability.startTime ? ability.startTime - effectTime : 0
                return {
                    type,
                    payload: {
                        name,
                        time
                    }
                }
            })

            return [...events, effectEvents]
            
        }
    },
    "void-bolt-cooldown-reduce-shadowfiend": {
        trigger: ({events, state}) => {
            const {effects, effectSettings, auras, abilities} = state
            if(!effectSettings) return events
            const name = "void-bolt-cooldown-reduce-shadowfiend"
            const targets = effectTargets[name]
            const {effectTime} = effectSettings[name]

            if(!effects[name].active) return events
            if(!auras["fae-blessings"].active) return events

            const type = "ABILITY_COOLDOWN_START"
            const effectEvents = targets.map(name => {
                const ability = abilities.cooldowns[name]
                const time = ability.startTime ? ability.startTime - effectTime : 0
                return {
                    type,
                    payload: {
                        name,
                        time
                    }
                }
            })

            return [...events, effectEvents]
        }
    },
    "voidform-deactivate-void-eruption": {
        trigger: ({events, state}) => {
            const name = "voidform-deactivate-void-eruption"
            const type = "ABILITY_DEACTIVATE"

            const effectEvent = {
                type,
                payload: {
                    name: "void-eruption"
                }
            }

            return [...events, effectEvent]
        }
    }
}