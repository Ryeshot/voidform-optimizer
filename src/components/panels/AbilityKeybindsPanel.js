import React, {useState, useEffect, useReducer, useRef} from 'react';
import Panel from "./Panel"
import {keybinds} from "../../lib/constants"
import "./Panel.css"
import "./Tooltip.css"

const AbilityIndex = (props) => {

    const {name, count, onChange, value} = props

    const handleChange = (e) => {
        onChange(parseInt(e.target.value), name)
    }

    return (
        <div>
            <select className="panel-dropdown" value={value} onChange={handleChange}>
                {[...Array(count).keys()].map(i => <option key={`${name}-index-${i}`} value={i+1}>{i+1}</option>)}
            </select>
        </div>
    )
}

const AbilityKeybindsPanel = (props) => {

    const {abilities, currentPanel, onKeybind, setOrder, onToggle, onClick, closePanel} = props

    const panel = "abilitykeybinds"
    const header = "Ability and Keybinds"
    const panelClass = "bottom-panel"

    const defaultState = {
        tooltip: "",
        keybindText: "",
        currentAbility: ""
    }

    const [tooltip, setTooltip] = useState(defaultState.tooltip)
    const [keybindText, setKeybindText] = useState(defaultState.keybindText)
    const [currentAbility, setCurrentAbility] = useState(defaultState.currentAbility)
    const [abilityCount] = useState(Object.keys(abilities).length-1)

    const handleClose = () => {
        setTooltip(defaultState.tooltip)
        setKeybindText(defaultState.keybindText)
        setCurrentAbility(defaultState.currentAbility)

        closePanel()
    }

    const currentAbilityRef = useRef(currentAbility)
    currentAbilityRef.current = currentAbility

    const showToolTip = (e) => {
        setTooltip(e.target.alt)
    }

    const hideToolTip = () => {
        setTooltip("")
    }

    const prepareToBindAbility = (e) => {
        let ability = e.target.getAttribute("ability")
        setCurrentAbility(ability)

        setKeybindText(`Press any key to bind to ${abilities[ability].displayName}`)

        document.addEventListener("keydown", handleKeyDown, {once: true})
        document.addEventListener("keypress", handleKeyPress, {once: true})
    }

    const handleKeyDown = (event) => {
        //check to see if we prevent default or not
        const {key} = event

        if(!isKeydownKey(key)) return

        event.preventDefault()
        bindAbility(key)

        //if keybind was found, prevent default and bind ability

        //if keybind was not found, return
    }

    const handleKeyPress = (e) => bindAbility(e.key)

    const isKeydownKey = (key) => {     
        if(key.match(/F[1-9]{1,2}/)) return true

        return false
    }

    const formKeybindFromKey = (key) => {
        if(keybinds[key]) 
            return {key, keybindText: keybinds[key]}
        if(key.match(/^[a-z]$/)) 
            return {key, keybindText: key.toUpperCase() }
        if(key.match(/^[A-Z]$/)) 
            return {key, keybindText: "S-" + key }
        
        return {key, keybindText: key}
    }

    const bindAbility = (key) => {
        document.removeEventListener("keypress", handleKeyPress)
        
        const keybind = formKeybindFromKey(key)
        
        let ability = currentAbilityRef.current 

        onKeybind(keybind, ability)
        setKeybindText(`${abilities[ability].displayName} successfuly bound to ${keybind.keybindText}`)
    }

    const reset = () => {
        document.removeEventListener("keydown", handleKeyDown)
        document.removeEventListener("keypress", handleKeyPress)
        setTooltip(defaultState.tooltip)
        setKeybindText(defaultState.keybindText)
        setCurrentAbility(defaultState.currentAbility)
    }

    return (
        <Panel panel={panel} currentPanel={currentPanel} reset={reset} onClick={onClick} header={header} style={{transform: `translateY(${currentPanel === panel ? "0px": "250px"}`}} panelClass={panelClass} handleClose={handleClose}>
            <div className="horizontal-panel-content">
                <div className="panel-content-header">Change Abilities and Keybinds</div>
                <div className="tooltip">
                    <span className="tooltip-text" visibility={(!!tooltip).toString()}>
                        {tooltip}
                    </span>
                </div>
                <div className="panel-abilities-content">
                    <div className="panel-abilities-header">
                        Spell Order
                    </div>
                    <div className="panel-abilities-container">
                        {Object.keys(abilities).map(k => {
                            if(k === "void-eruption") return
                            return <div className="panel-ability-container" key={k}>
                                <img  
                                    className="hover-pointer" 
                                    alt={abilities[k].displayName}
                                    ability={k} 
                                    onMouseOver={showToolTip}
                                    onMouseOut={hideToolTip}
                                    onClick={prepareToBindAbility}
                                    src={abilities[k].icon}
                                    height={50}
                                    width={50}
                                />
                                <button className={`${abilities[k].disabled ? "panel-button-secondary" : "panel-button"}`} onClick={() => onToggle(k)}>{abilities[k].disabled ? "Enable" : "Disable"}</button>
                                <AbilityIndex name={k} count={abilityCount} value={abilities[k].index} onChange={setOrder} />
                            </div>
                    })}
                    </div>
                </div>
                <div>{keybindText ? keybindText : null}</div>
            </div>
        </Panel>
    )
}

export default AbilityKeybindsPanel