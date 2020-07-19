import {globalEffects, auraEffects, abilityEffects} from "../lib/eventEffects"
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

    getGlobalEffects(events){
        return Object.keys(globalEffects).reduce((effects, k) => {
            if(events.find(e => e.type === k))
                effects = [...effects, ...globalEffects[k]]
            return effects
        }, [])
    }

    addEventEffects(source, event, effects){
        const sourceEffects = this.effects[source]
        if(!sourceEffects) return effects
        const eventEffects = sourceEffects.onEvent[event] || []
        return [...effects, ...eventEffects]
    }

    transformEvents(source, event, data){
        const {events} = data

        let eventEffects = this.getGlobalEffects(events)
        console.log(eventEffects)
        eventEffects = this.addEventEffects(source, event, eventEffects)
        if(eventEffects.length === 0) return events
        console.log(eventEffects)

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
        console.log("Inside effect trigger")
        effectNames.forEach(name => {
            console.log("Triggering effect: " + name)
            data.events = effects[name].trigger({...data, state: this.state.current})
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

        data.events = events
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

        data.events = events
    }
}

export default EffectHandler