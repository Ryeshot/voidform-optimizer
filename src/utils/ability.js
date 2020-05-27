import {constructEventHandler} from "./eventHandler"
import {interval, lag} from "./constants"

class Ability {

    constructor(initialState, updateFn, onExecute, eventHandler) {
        console.log("Inside ability constructor")
        this.state = initialState
        this.updateState = updateFn
        this.onExecute = onExecute
        this.eventHandler = eventHandler
    }

    static create(type, initialState, updateFn, onExecute, triggers) {
        const eventHandler = constructEventHandler(initialState.name, triggers)
        switch(type) {
            case "instant":
                return new InstantAbility(initialState, updateFn, onExecute, eventHandler)
            case "cast":
                return new CastAbility(initialState, updateFn, onExecute, eventHandler)
            case "channel":
                return new ChannelAbility(initialState, updateFn, onExecute, eventHandler)
        }
    }

    getCurrentState() {
        const currentState = {}
        let state = this.state

        Object.keys(state).forEach(k => {
            //console.log(k)
            let value = state[k]
            if(typeof value !== "object") {
                currentState[k] = value
                return
            }

            const subState = {}
            //console.log(value)
            Object.keys(value).forEach(k2 => {
                let value2 = value[k2]
                subState[k2] =  value2.current
            })
            currentState[k] = subState
        })

        //console.log(currentState)

        return currentState
    }

    startCooldown() {
        let state = this.getCurrentState()
        const {name} = state
        //const {startTime} = state.cooldown
        const {maxCharges} = state.charges

        this.cooldownTimer = setInterval(() => {
            let now = Date.now()

            let duration = this.state.cooldown.duration.current
            let startTime = this.state.cooldown.startTime.current || now
            let charges = this.state.charges.current.current
            let remaining = (startTime + duration) - now

            if(remaining <= interval + lag) {
                this.updateState(state => {
                    return {...state, charges: charges+1}
                })

                clearInterval(this.cooldownTimer)

                if(maxCharges && charges < maxCharges - 1) {
                    this.startCooldown()
                    return
                }

                this.eventHandler.handleEvent("COOLDOWN_END", {name})

                this.updateState(state => {
                    return {...state, progress: 0}
                })

                return
            }
            this.updateState(state => {
                return {...state, progress: remaining/duration}
            })

        }, interval)

        this.eventHandler.handleEvent("COOLDOWN_START", {
            name,
            time: Date.now()
        })
    }

    startCast() {
        let state = this.getCurrentState()
        const {name, resource} = state
        const {duration} = state.cast

        //console.log("Beginning cast...")

        this.castTimer = setTimeout(() => {
            this.eventHandler.handleEvent("CAST_SUCCESS", {
                name,
                resource
            })

            let cooldown = this.state.cooldown.duration.current
            let charges = this.state.charges.current.current

            console.log("Ending cast...")
            console.log(charges)

            if(cooldown) {
                this.updateState(state => {
                    return {...state, charges: charges-1}
                })
                
                this.startCooldown()
            }

        }, duration)

        this.eventHandler.handleEvent("CAST_START", {
            name,
            duration,
            time: Date.now()
        })
    }

    startChannel() {
        let state = this.getCurrentState()
        const {startTime, endTime, duration} = state.cast
        const {baseDuration, ticks} = state.channel
        const {resource, name} = state

        let now = Date.now()
        let pandemicTime = 0
        let currentTicks = ticks

        if(startTime) {
            clearInterval(this.channelTimer)
            let previousChannelTime = endTime - startTime
            let previousChannelRemaining = previousChannelTime - (now - startTime)
            let previousChannelFrequency = (baseDuration/currentTicks)        
            pandemicTime = Math.min(previousChannelRemaining, baseDuration * .3)
            let remainingTicks = Math.floor(pandemicTime/previousChannelFrequency)
            currentTicks += remainingTicks
        }

        let channelFrequency = Math.round((duration+pandemicTime)/currentTicks)

        this.channelTimer = setInterval(() => {

            let now = Date.now()

            this.eventHandler.handleEvent("CHANNEL_UPDATE", {
                resource: resource/currentTicks
            })

            if(now >= this.state.cast.endTime.current) {
                clearInterval(this.channelTimer)

                this.eventHandler.handleEvent("CHANNEL_END", {
                    name
                })
                return
            }

        }, channelFrequency)

        this.eventHandler.handleEvent("CHANNEL_START", {
            name,
            duration: duration + pandemicTime,
            time: now,
            baseChannelTime: duration
        })
    }

    beginGlobalCooldown() {
        let state = this.getCurrentState()
        const {duration, startTime} = state.globalCooldown

        //console.log(duration)

        //console.log("Inside gcd for " + state.name)

        let start = Date.now()

        if(state.cooldown.startTime) {
            let remaining = (state.cooldown.startTime + state.cooldown.duration) - start
            if(remaining > duration) return
        }

        this.globalCooldownTimer = setInterval(() => {
            let now = Date.now()
            let remaining = ((startTime || start) + duration) - now
            if(remaining <= interval + lag) {
                clearInterval(this.globalCooldownTimer)               
                return
            }

            if(this.state.cooldown.startTime.current) return
            this.updateState(state => {
                return {...state, progress: remaining/duration}
            })
        }, interval)
    }

    remove() {
        clearInterval(this.cooldownTimer)
        clearInterval(this.globalCooldownTimer)
        clearInterval(this.channelTimer)
        clearTimeout(this.castTimer)
    }
}

class InstantAbility extends Ability {

    execute() {
        console.log("Preparing to execute ability...")
        let state = this.getCurrentState()
        const {name, resource} = state
        const {startTime} = state.cooldown
        const {maxCharges, current} = state.charges
        //console.log(this.state)
        if(startTime && current === 0) return      
        this.updateState(state => {
            return {...state, charges: current-1}
        })

        this.eventHandler.handleEvent("CAST_SUCCESS", {
            name,
            resource
        })

        console.log("Cast success!")
        console.log(resource)

        this.onExecute()
        //if has charges and current charges < max - 1
        if(maxCharges && current < maxCharges - 1) return
        this.startCooldown()
    }
}

class CastAbility extends Ability {

    execute() {
        console.log("Preparing to execute ability...")
        let state = this.getCurrentState()
        const {startTime} = state.cast
        const {current} = state.charges
        //console.log(current)
        if(startTime || current === 0) return
        console.log("Preparing to start cast...")
        this.startCast()
        //console.log(this.onExecute)
        this.onExecute()
    }
}

class ChannelAbility extends Ability {

    execute() {
        console.log("Preparing to execute ability...")
        let state = this.getCurrentState()
        const {duration, startTime} = state.cooldown
        if(startTime) return
        this.startChannel()
        //ability has a cooldown
        if(duration) {
            this.startCooldown()
        }
        this.onExecute()
    }
}

export default Ability