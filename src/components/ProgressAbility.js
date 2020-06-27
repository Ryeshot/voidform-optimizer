import React, {useState, useEffect, useRef} from 'react';
import "./ProgressAbility.css"
import CooldownSweep from "./CooldownSweep"
import Ability from "../utils/ability"

const ProgressAbility = (props) => {

    const {name, displayName, settings, cooldown, globalCooldown, globalCooldownStartTime, unusable, startTime, casttime, castStartTime, castEndTime, icon, baseChannelTime, keybind, casting, subscribe, unsubscribe, onExecute, onAbilityUpdate, onClick, triggerEvent, reset} = props

    const size = 50

    const [state, setState] = useState({})

    const {key, keybindText} = keybind
    const {type, resource, costsResource, charges, ticks} = settings

    //cooldown states
    const startTimeRef = useRef(startTime)
    const cooldownRef = useRef(cooldown)

    startTimeRef.current = startTime
    cooldownRef.current = cooldown

    //cast states
    const castStartTimeRef = useRef(castStartTime)
    const castEndTimeRef = useRef(castEndTime)
    const casttimeRef = useRef(casttime)
    const castingRef = useRef(casting)

    castStartTimeRef.current = castStartTime
    castEndTimeRef.current = castEndTime
    casttimeRef.current = casttime
    castingRef.current = casting

    //channel states
    const baseChannelTimeRef = useRef(baseChannelTime)

    baseChannelTimeRef.current = baseChannelTime

    //charge states
    const chargesRef = useRef(charges || 1)

    chargesRef.current = state.charges

    //gcd states
    const globalCooldownRef = useRef(globalCooldown)
    const globalCooldownStartTimeRef = useRef(globalCooldownStartTime)

    globalCooldownRef.current = globalCooldown
    globalCooldownStartTimeRef.current = globalCooldownStartTime

    //other states
    const unusableRef = useRef(unusable)
    unusableRef.current = unusable

    const ability = useRef()

    useEffect(() => {
        const triggers = [{
            eventTypes: ["CAST"],
            trigger: onAbilityUpdate 
        },
        {
            eventTypes: ["RESOURCE", "AURA", "STAT"],
            trigger: triggerEvent
        }]

        const initialState = {
            name,
            displayName,
            resource,
            costsResource,
            unusable: unusableRef,
            cooldown: {
                duration: cooldownRef,
                startTime: startTimeRef
            },
            cast: {
                duration: casttimeRef,
                startTime: castStartTimeRef,
                endTime: castEndTimeRef,
                casting: castingRef
            },
            channel: {
                baseDuration: baseChannelTimeRef,
                ticks
            },
            charges: {
                maxCharges: charges,
                current: chargesRef
            },
            globalCooldown: {
                duration: globalCooldownRef,
                startTime: globalCooldownStartTimeRef
            }
        }

        ability.current = Ability.create(type, initialState, setState, onExecute, triggers)
        
        subscribe({
            source: name,
            keybind: key,
            execute: () => ability.current.execute(),
            notify: () => ability.current.beginGlobalCooldown(),
            getRemainingCooldown: () => ability.current.getRemainingCooldown()
        })

        return () => {
            ability.current.remove()
            unsubscribe(name)
        }
    }, [key, reset])

    const handleClick = () => {
        onClick(name, () => ability.current.getRemainingCooldown(), () => ability.current.execute())
    }

    return (
        <div className="progress-ability-container">
        <div className="progress-ability" onClick={handleClick}>
            <img
                className={!unusable && ((state.charges > 0 && charges) || (!startTimeRef.current)) ? "colored" : "desaturated"}
                src={icon}
                width={size}
                height={size}
            />
            <div className="charge-text">{charges > 1 ? state.charges : ""}</div>
            {startTimeRef.current || globalCooldownRef.current ? 
            <CooldownSweep size={size} progress={state.progress}/>
            : null}
        </div>
        <div>{keybindText}</div>
        </div>
    )
}

export default ProgressAbility;