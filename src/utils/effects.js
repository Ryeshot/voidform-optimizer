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
            const name = "void-bolt-cooldown-reset"
            if(!effectSettings) return events
            if(!effectSettings[name]) return events
            if(!effects[name]) return events

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
            const name = "void-bolt-cooldown-reduce-fae-blessing"
            if(!effectSettings) return events
            if(!effectSettings[name]) return events
            if(!effects[name]) return events

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

            return [...events, ...effectEvents]
            
        }
    },
    "void-bolt-cooldown-reduce-shadowfiend": {
        trigger: ({events, state}) => {
            console.log(state) 
            const {effects, effectSettings, auras, abilities} = state
            const name = "void-bolt-cooldown-reduce-shadowfiend"
            if(!effectSettings) return events
            if(!effectSettings[name]) return events
            if(!effects[name]) return events

            const targets = effectTargets[name]
            const {effectTime} = effectSettings[name]

            if(!effects[name].active) return events

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

            const stackEvent = {
                type: "AURA_STACK_UPDATE",
                payload: {
                    name: "fae-blessings",
                    stack: -1
                }
            }

            //console.log([...events, effectEvents])

            return [...events, ...effectEvents, stackEvent]
        }
    },
    "voidform-deactivate-void-eruption": {
        trigger: ({events}) => {
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
    },
    "calculate-resource": {
        trigger: ({events, state}) => {
            //console.log("Calculating resource!")
            return events
        }
    },
    "dark-thoughts": {
        trigger: ({events, state}) => {
            const {effects, effectSettings, auras, abilitySettings, abilities} = state
            const name = "dark-thoughts"
            if(!effectSettings) return events
            if(!effectSettings[name]) return events
            if(!effects[name]) return events

            const {effectTime, effectChance} = effectSettings[name]
            const dots = ["shadow-word-pain", "vampiric-touch", "devouring-plague"]

            const currentChance = dots.reduce((sum, dot) => {
                if(auras[dot] && auras[dot].active) sum += effectChance
                return sum
            }, 0)

            if(effectTriggered(currentChance)) {
                const abilityName = "mind-blast"
                const mindblast = abilitySettings[abilityName]
                const charges = abilities.cooldowns[abilityName].currentCharges
                mindblast.casttime = 0
                events.push({
                    type: "ABILITY_CHARGE_UPDATE",
                    payload: {
                        name: abilityName,
                        charges: (charges < 5 && charges + 1) || charges
                    }
                })
            }
            
            return events
        }
    }
}