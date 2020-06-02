import {constructEventHandler} from "./eventHandler"
import {interval, lag} from "../lib/constants"

class Ability {

    constructor(initialState, updateFn, onExecute, eventHandler) {
        this.state = initialState
        this.updateState = updateFn
        this.onExecute = onExecute
        this.eventHandler = eventHandler
        this.updateState({
            progress: 0,
            charges: initialState.charges.maxCharges || 1
        })       
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
            let value = state[k]
            if(typeof value !== "object") {
                currentState[k] = value
                return
            }

            const subState = {}
            Object.keys(value).forEach(k2 => {
                let value2 = value[k2]
                if(value2 === "undefined") return
                subState[k2] =  typeof value2 !== "object" ? value2 : value2.current
            })
            currentState[k] = subState
        })

        return currentState
    }

    startCooldown() {
        let state = this.getCurrentState()
        const {name} = state
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
        const {name, displayName, resource} = state
        const {duration} = state.cast

        console.log("Preparing to cast")
        console.log(state)

        this.castTimer = setTimeout(() => {
            console.log("Cast success!")
            this.eventHandler.handleEvent("CAST_SUCCESS", {
                name,
                resource,
                time: Date.now()
            })

            let cooldown = this.state.cooldown.duration.current
            let currentlyOnCooldown = this.state.cooldown.startTime.current
            let charges = this.state.charges.current.current

            if(cooldown) {
                this.updateState(state => {
                    return {...state, charges: charges-1}
                })
                if(currentlyOnCooldown) return               
                this.startCooldown()
            }

        }, duration)

        this.eventHandler.handleEvent("CAST_START", {
            name,
            displayName,
            duration,
            time: Date.now()
        })
    }

    startChannel() {
        let state = this.getCurrentState()
        const {startTime, endTime, duration} = state.cast
        const {baseDuration, ticks} = state.channel
        const {name, displayName, resource} = state

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
            let endTime = this.state.cast.endTime.current

            //another cast has stopped this channel, don't update
            if(!endTime) {
                clearInterval(this.channelTimer)

                this.eventHandler.handleEvent("CHANNEL_END", {
                    name
                })
                return
            }

            this.eventHandler.handleEvent("CHANNEL_UPDATE", {
                resource: resource/ticks
            })

            if(now >= endTime) {
                clearInterval(this.channelTimer)

                this.eventHandler.handleEvent("CHANNEL_END", {
                    name
                })
                return
            }

        }, channelFrequency)

        this.eventHandler.handleEvent("CHANNEL_START", {
            name,
            displayName,
            duration: duration + pandemicTime,
            time: now,
            baseChannelTime: duration
        })
    }

    beginGlobalCooldown() {
        let state = this.getCurrentState()
        const {duration, startTime} = state.globalCooldown

        if(state.cooldown.startTime) {
            let remaining = (state.cooldown.startTime + state.cooldown.duration) - startTime
            if(remaining > duration) return
        }

        this.globalCooldownTimer = setInterval(() => {
            let now = Date.now()
            let remaining = (startTime + duration) - now
            if(remaining <= interval) {
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
        if(this.state.globalCooldown.duration.current) return
        if(this.state.unusable) return
        if(this.state.cast.casting.current) return
        let state = this.getCurrentState()
        const {name, resource} = state
        const {startTime} = state.cooldown
        const {maxCharges, current} = state.charges

        if(startTime && current === 0) return      
        this.updateState(state => {
            return {...state, charges: current-1}
        })

        this.eventHandler.handleEvent("CAST_SUCCESS", {
            name,
            resource,
            time: Date.now()
        })

        this.onExecute()
        if(maxCharges && current < maxCharges) return
        this.startCooldown()
    }
}

class CastAbility extends Ability {

    execute() {
        if(this.state.globalCooldown.duration.current) return
        if(this.state.unusable) return
        if(this.state.cast.casting.current) return
        let state = this.getCurrentState()
        const {startTime} = state.cast
        const {current} = state.charges

        if(startTime || current === 0) return
        this.startCast()
        this.onExecute()
    }
}

class ChannelAbility extends Ability {

    execute() {
        if(this.state.globalCooldown.duration.current) return
        if(this.state.unusable) return
        if(this.state.cast.casting.current) return
        let state = this.getCurrentState()
        const {duration, startTime} = state.cooldown

        if(startTime) return
        this.startChannel()
        if(duration) {
            this.startCooldown()
        }
        this.onExecute()
    }
}

export default Ability