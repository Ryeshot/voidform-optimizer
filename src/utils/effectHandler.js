import abilityEffects from "../lib/abilityEffects"
import auraEffects from "../lib/auraEffects"
import effects from "./effects"
import events from "../lib/events"

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
        let {events} = data
        if(!effects) return events

        const eventEffects = effects.onEvent[event]
        if(!eventEffects) return events

        data = {...data, state: this.state}

        eventEffects.forEach(({type, effects}) => {
            switch(type){
                case "TRIGGER":
                    this.handleEffectTrigger(effects, data)
                    return
                case "ACTIVATE":
                    this.handleEffectActivate(effects, data)
                    return
                case "DEACTIVATE":
                    this.handleEffectDeactivate(effects, data)
                    return
                default:
                    return null
            }
        })

        return data.events
    }
    
    handleEffectTrigger(effectNames, data){
        effectNames.forEach(name => {
            data.events = effects[name].trigger(data)
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