import abilityEffects from "../lib/abilityEffects"
import auraEffects from "../lib/auraEffects"
import effects from "./effects"

class EffectHandler {
    constructor(state, effects){
        this.state = state
        this.effects = effects
    }

    static forAbility(state){
        return new EffectHandler(state, abilityEffects)
    }
    static forAura(state){
        return new EffectHandler(state, auraEffects)
    }

    transformEvents(source, event, data){
        const effects = this.effects[source]
        if(!effects) return data.events

        const eventEffects = effects.onEvent[event]
        if(!eventEffects) return data.events

        data = {...data, state: this.state}

        eventEffects.forEach(({type, effects}) => {
            switch(type){
                case "TRIGGER":
                    return this.handleEffectTrigger(effects, data)
                case "ACTIVATE":
                    return this.handleEffectActivate(effects, data)
                case "DEACTIVATE":
                    return this.handleEffectDeactive(effects, data)
                default:
                    return null
            }
        })
    }
    
    handleEffectTrigger(effectNames, data){
        effectNames.forEach(name => {
            effects[name](data)
        })
    }

    handleEffectActivate(effects, data){
        let {events} = data
        effects.forEach(name => {
            const event = {
                type: "EFFECT_ACTIVATE",
                payload: {
                    name
                }
            }
            events = [...events, event]
        })

        return events
    }

    handleEffectDeactivate(effects, data){
        let {events} = data
        effects.forEach(name => {
            const event = {
                type: "EFFECT_DEACTIVATE",
                payload: {
                    name
                }
            }
            events = [...events, event]
        })

        return events
    }
}

export default EffectHandler