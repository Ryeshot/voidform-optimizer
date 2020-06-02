import events from "../lib/events"
import abilityEvents from "../lib/abilityEvents"

class EventHandler {

    constructor(eventTriggers, events) {
        this.eventTriggers = eventTriggers
        this.events = events
    }

    handleEvent(event, payload) {
        if(!this.events[event]) return
        //console.log(event)
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