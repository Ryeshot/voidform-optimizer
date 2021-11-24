import toggle from "./featureToggle"

const effectTargets = {
    "void-bolt-cooldown-reset": ["void-bolt"],
    "void-bolt-cooldown-reduce-fae-blessings": ["fae-blessings"],
    "void-bolt-cooldown-reduce-shadowfiend": ["shadowfiend"]
}

const effectTriggered = (chance) => Date.now() % 100 < (chance * 100)

const original = {}

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
            return events
        }
    },
    "dark-thoughts": {
        trigger: ({events, state}) => {
            const {effects, effectSettings, auras, auraSettings, abilitySettings, abilities} = state
            const name = "dark-thoughts"
            if(!toggle.isEffectEnabled(name)) return events
            if(!effectSettings?.[name]) return events
            if(!effects?.[name].active) return events
            const {procChance} = effectSettings[name]
            const dots = ["shadow-word-pain", "vampiric-touch", "devouring-plague"]
            const currentChance = dots.reduce((sum, dot) => {
                if(auras[dot] && auras[dot].active) sum += procChance
                return sum
            }, 0)
            if(!effectTriggered(currentChance)) return events
            const abilityName = "mind-blast"
            const mindblast = abilitySettings[abilityName]
            const abilityState = abilities.cooldowns[abilityName]
            const auraState = auras[name]
            const currentCharges = !abilityState.startTime ? 1 : 0
            const charges = abilityState.currentCharges || currentCharges
            const maxStacks = auraSettings[name].maxStacks
            const maxCharges = mindblast.charges + maxStacks
            const time = Date.now()
            if(charges < maxCharges){
                events.push({
                    type: "ABILITY_CHARGE_UPDATE",
                    payload: {
                        name: abilityName,
                        charges: Math.min(charges + 1, maxCharges)
                    }
                })
            }
            if(auraState.active){
                events.push({
                    type: "AURA_REFRESH",
                    payload: { 
                        name,
                        time,
                        maxStacks
                     }
                })
            }
            if(!auraState.active){
                events.push({
                    type: "AURA_START",
                    payload: { 
                        name,
                        time
                    }
                })
                original["mind-blast"] = {...mindblast}
                mindblast.casttime = 0
                mindblast.charges = maxCharges
            }

            return events
        },
        remove: ({events, state}) => {
            const {effects, effectSettings, auras, auraSettings, abilitySettings, abilities} = state
            const name = "dark-thoughts"
            if(!toggle.isEffectEnabled(name)) return events
            if(!effectSettings?.[name]) return events
            if(!effects?.[name].active) return events
            if(!auras[name].active) return events

            const auraState = auras[name]
            const mindblast = abilitySettings["mind-blast"]

            events.push({
                type: "AURA_STACK_UPDATE",
                payload: {
                    name: name,
                    stacks: auraState.stacks - 1
                }
            })

            if(auraState.stacks - 1 <= 0){
                mindblast.casttime = original["mind-blast"].casttime
                mindblast.charges = original["mind-blast"].charges
            }

            return events
        },
        update: ({events, state}) => {
            const {auras, abilities} = state
            const name = "dark-thoughts"
            if(!toggle.isEffectEnabled(name)) return events
            if(!auras[name].active) return events
            const castingAbility = abilities.casting?.name
            if(castingAbility !== "mind-flay" && castingAbility !== "mind-sear") return events
            return events.filter(e => e.type !== "ABILITY_CAST_SUCCESS")
        }
    }
}