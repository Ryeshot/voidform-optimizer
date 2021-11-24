import React, {useState, useEffect, useRef} from 'react';
import "./ProgressAbility.css"
import CooldownSweep from "./CooldownSweep"
import Ability from "../utils/ability"

const ProgressAbility = (props) => {

    const {name, abilityState, cooldownState, settings, cooldown, globalCooldown, globalCooldownStartTime, 
        casttime, casting, subscribe, unsubscribe, onExecute, onClick, dispatch, effectHandler, show, reset} = props

    const size = 50

    const [state, setState] = useState({})

    const {type, resource, resourceCost, costType, charges, ticks, ignoreGcd} = settings
    const {startTime, castStartTime, castEndTime, baseChannelTime, currentTicks, currentCharges} = cooldownState
    const {unusable, displayName, icon, keybind} = abilityState
    const {key, keybindText} = keybind

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
    const ticksRef = useRef(currentTicks)

    baseChannelTimeRef.current = baseChannelTime
    ticksRef.current = currentTicks

    //charge states
    const chargesRef = useRef(charges || 1)
    const maxChargesRef = useRef(charges || 1)
    chargesRef.current = currentCharges !== undefined ? currentCharges : charges
    maxChargesRef.current = charges

    //gcd states
    const globalCooldownRef = useRef(globalCooldown)
    const globalCooldownStartTimeRef = useRef(globalCooldownStartTime)

    globalCooldownRef.current = globalCooldown
    globalCooldownStartTimeRef.current = globalCooldownStartTime

    //other states
    const unusableRef = useRef(unusable)
    unusableRef.current = unusable

    const disabledRef = useRef(!show)
    disabledRef.current = !show

    const ability = useRef()

    useEffect(() => {
        const initialState = {
            name,
            displayName,
            resource,
            resourceCost,
            costType,
            unusable: unusableRef,
            disabled: disabledRef,
            ignoreGcd,
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
                baseTicks: ticks,
                ticks: ticksRef
            },
            charges: {
                maxCharges: maxChargesRef,
                current: chargesRef
            },
            globalCooldown: {
                duration: globalCooldownRef,
                startTime: globalCooldownStartTimeRef
            }
        }

        ability.current = Ability.create(type, initialState, setState, onExecute, dispatch, effectHandler)
        
        subscribe({
            source: name,
            keybind: key,
            execute: () => ability.current.execute(),
            notify: () => ability.current.beginGlobalCooldown(),
            getRemainingCooldown: () => ability.current.getRemainingCooldown(),
            canExecute: () => ability.current.canExecute(),
            ignoresGcd: !!ignoreGcd
        })

        return () => {
            ability.current.remove()
            unsubscribe(name)
        }
    }, [key, reset])

    const handleClick = () => {
        onClick(name, () => ability.current.getRemainingCooldown(), () => ability.current.execute(), () => ability.current.canExecute(), !!ignoreGcd)
    }

    return (
        show ? <div className="progress-ability-container">
            <div className="progress-ability hover-pointer" onClick={handleClick}>
                <img
                    className={!unusable && ((chargesRef.current > 0 && charges) || (!startTimeRef.current)) ? "colored" : "desaturated"}
                    src={icon}
                    width={size}
                    height={size}
                />
                <div className="charge-text">{chargesRef.current > 1 ? chargesRef.current : ""}</div>
                {startTimeRef.current || globalCooldownRef.current ? 
                <CooldownSweep size={size} progress={state.progress}/>
                : null}
            </div>
            <div>{keybindText}</div>
        </div>
        : null
    )
}

export default ProgressAbility;