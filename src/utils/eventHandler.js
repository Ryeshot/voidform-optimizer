import events from "../lib/events"
import abilityEvents from "../lib/abilityEvents"
import auraEvents from "../lib/auraEvents"

class EventHandler {

    constructor(eventTriggers, events) {
        this.eventTriggers = eventTriggers
        this.events = events
    }

    handleEvent(event, payload) {
        if(!this.events[event]) return

        this.events[event].forEach(e => this.eventTriggers[e]({
            type: e,
            payload
        }))
    }
}

export const constructEventHandler = (name, triggers) => {
    const eventTriggers = {}

    triggers.forEach(trigger => {
        let types = trigger.eventTypes
        types.forEach(type => {
            events[type].forEach(e => eventTriggers[e] = trigger.trigger)
        })
    })

    return new EventHandler(eventTriggers, abilityEvents[name].onEvent)
}

export const auraEventHandler = (name, trigger) => {
    const types = ["AURA", "RESOURCE", "STAT"]
    const eventTriggers = {}

    types.forEach(type => {
        events[type].forEach(e => eventTriggers[e] = trigger)
    })

    return new EventHandler(eventTriggers, auraEvents[name].onEvent)
}