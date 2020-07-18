import events from "../lib/events"
import abilityEvents from "../lib/abilityEvents"
import auraEvents from "../lib/auraEvents"

class EventHandler {

    constructor(eventTrigger, events, name, effectHandler) {
        this.eventTrigger = eventTrigger
        this.events = events
        this.effectHandler = effectHandler
        this.source = name
    }

    prepareEvents(events, payload){
        return events.map(e => ({type: e, payload}))
    }

    handleEvent(event, payload) {
        if(!this.events[event]) return

        let events = this.prepareEvents(this.events[event], payload)
        events = this.effectHandler.transformEvents(this.source, event, {events, payload})
        console.log(events)
        events.forEach(e => this.eventTrigger(e))
    }
}

export const constructEventHandler = (name, trigger, effectHandler) => {
    return new EventHandler(trigger, abilityEvents[name].onEvent, name, effectHandler)
}

export const auraEventHandler = (name, trigger, effectHandler) => {
    return new EventHandler(trigger, auraEvents[name].onEvent, name, effectHandler)
}