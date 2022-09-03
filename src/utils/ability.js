import {constructEventHandler} from "./eventHandler"
import {interval, lag} from "../lib/constants"

class Ability {
    constructor(initialState, updateFn, onExecute, eventHandler) {
        this.state = initialState
        this.updateState = updateFn
        this.onExecute = initialState.ignoreGcd ? () => {} : onExecute
        this.eventHandler = eventHandler
        this.updateState({
            progress: 0,
            charges: initialState.charges.maxCharges || 1
        })       
    }

    static create(type, initialState, updateFn, onExecute, trigger, effectHandler) {
        const eventHandler = constructEventHandler(initialState.name, trigger, effectHandler)
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

    getRemainingCooldown() {
        const name = this.state.name
        const now = Date.now()
        const startTime = this.state.cooldown.startTime.current
        const duration = startTime ? this.state.cooldown.duration.current : 0
        const charges = this.state.charges.current.current || 0
        const remaining = charges === 0 ? ((startTime || now) + duration) - now : 0
        return remaining
    }

    startCooldown() {
        let state = this.getCurrentState()
        const {name} = state

        this.cooldownTimer = setInterval(() => {
            let now = Date.now()
            let duration = this.state.cooldown.duration.current
            let startTime = this.state.cooldown.startTime.current || now
            let charges = this.state.charges.current.current
            let maxCharges = this.state.charges.maxCharges.current
            let remaining = (startTime + duration) - now

            if(remaining <= interval) {
                if(maxCharges) {
                    this.eventHandler.handleEvent("CHARGES_UPDATE", {
                        name,
                        charges: Math.min(charges + 1, maxCharges)
                    })
                }
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

    cast() {
        let state = this.getCurrentState()
        const {name, resource, resourceCost, costType} = state

        this.eventHandler.handleEvent("CAST_SUCCESS", {
            name,
            resource,
            resourceCost,
            costType,
            time: Date.now()
        })

        let cooldown = this.state.cooldown.duration.current
        let currentlyOnCooldown = this.state.cooldown.startTime.current
        let charges = this.state.charges.current.current

        if(cooldown) {
            this.eventHandler.handleEvent("CHARGES_UPDATE", {
                name,
                charges: charges-1
            })
            if(currentlyOnCooldown) return               
            this.startCooldown()
        }
    }

    startCast() {
        let state = this.getCurrentState()
        const {name, displayName} = state
        const {duration} = state.cast

        if(duration) {
            this.eventHandler.handleEvent("CAST_START", {
                name,
                displayName,
                duration,
                time: Date.now()
            })
        }

        this.castTimer = setTimeout(() => this.cast(), duration)
    }

    startChannel() {
        let state = this.getCurrentState()
        const {startTime, endTime, duration} = state.cast
        const {baseDuration, baseTicks, ticks} = state.channel
        const {name, displayName, resource} = state
        const gcd = state.globalCooldown.duration

        let now = Date.now()
        let pandemicTime = 0
        let currentTicks = baseTicks

        if(startTime) {
            clearInterval(this.channelTimer)
            const previousChannelTime = endTime - startTime
            const previousChannelRemaining = previousChannelTime - (now - startTime)
            const maximumTicks = Math.floor(baseTicks * ((baseDuration - gcd)/baseDuration))      
            pandemicTime = Math.min(previousChannelRemaining, baseDuration * .3)

            const remainingTicks = Math.min(ticks, maximumTicks)

            currentTicks += remainingTicks
        }

        let channelFrequency = Math.round((duration+pandemicTime)/currentTicks)

        this.channelTimer = setInterval(() => {

            let now = Date.now()
            let endTime = this.state.cast.endTime.current
            let lastTick = this.state.channel.ticks.current === 1
            let tickResourceModifier = lastTick ? (pandemicTime && .3 || 1) : 1

            //another cast has stopped this channel, don't update
            if(!endTime) {
                clearInterval(this.channelTimer)

                this.eventHandler.handleEvent("CHANNEL_END", {
                    name
                })
                return
            }

            this.eventHandler.handleEvent("CHANNEL_UPDATE", {
                resource: (resource/baseTicks) * tickResourceModifier,
                name
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
            baseChannelTime: duration,
            currentTicks
        })
    }

    beginGlobalCooldown() {
        let state = this.getCurrentState()
        const {duration, startTime} = state.globalCooldown
        const {current, maxCharges} = state.charges

        if(state.ignoreGcd) return

        if(state.cooldown.startTime) {
            if(maxCharges && current < maxCharges - 1) return
            let remaining = (state.cooldown.startTime + state.cooldown.duration) - startTime
            if(remaining > duration) return
        }

        this.globalCooldownTimer = setInterval(() => {
            let now = Date.now()
            let remaining = (startTime + duration) - now
            if(remaining <= interval) {
                clearInterval(this.globalCooldownTimer)
                this.updateState(state => {
                    return {...state, progress: 0}
                })
                             
                return
            }

            if(this.state.cooldown.startTime.current) return
            this.updateState(state => {
                return {...state, progress: remaining/duration}
            })
        }, interval)
    }

    canExecute() {
        if(this.state.disabled.current) return false
        if(this.state.unusable.current) return false
        return true
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
        if(!this.canExecute()) return
        if(this.state.cast.casting.current) return
        let state = this.getCurrentState()
        const {name, resource, resourceCost} = state
        const {startTime} = state.cooldown
        const {maxCharges, current} = state.charges

        if(startTime && current === 0) return      

        this.onExecute()
        this.cast()
        //if(maxCharges && current < maxCharges) return
        //this.startCooldown()
    }
}

class CastAbility extends Ability {

    execute() {
        if(!this.canExecute()) return
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
        if(!this.canExecute()) return
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