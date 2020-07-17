import React, {useState, useEffect, useReducer, useRef} from 'react';
import Panel from "./Panel"
import CustomizeSection from "./CustomizeSection"
import {abilityOptions, auraOptions} from "../../lib/options"
import "./Panel.css"

const SettingsPanel = (props) => {

    const {settings, currentPanel, didReset, onAbilitySet, onAuraSet, onClick, closePanel} = props

    const {abilities, auras} = settings

    const panel = "settings"
    const header= "Custom Settings"
    const panelClass = "right-panel"

    const abilityButtonText = "Update Abilities"
    const auraButtonText = "Update Auras"

    const changesPendingText =
`Changes pending...
Click the button below to apply your changes`

    const [currentAbilities, setCurrentAbilities] = useState(abilities)
    const [currentAuras, setCurrentAuras] = useState(auras)
    const [activeAbilitySection, setActiveAbilitySection] = useState(null)
    const [activeAuraSection, setActiveAuraSection] = useState(null)
    const [abilityChangesPending, setAbilityChangesPending] = useState(false)
    const [auraChangesPending, setAuraChangesPending] = useState(false)

    useEffect(() => {
        setCurrentAuras(auras)
        setCurrentAbilities(abilities)
    }, [didReset])

    useEffect(() => {
        if(currentPanel !== panel) return
        setActiveAbilitySection(Object.keys(abilities)[0])
        setActiveAuraSection(Object.keys(auras)[0])
    }, [currentPanel])

    const handleAbilitySettingChange = (setting, key) => {
        const newAbilities = {...currentAbilities, [key]: setting}
        setCurrentAbilities(newAbilities)
        setAbilityChangesPending(true)
    }

    const handleAuraSettingChange = (setting, key) => {
        const newAuras = {...currentAuras, [key]: setting}
        setCurrentAuras(newAuras)
        setAuraChangesPending(true)
    }

    const handleAbilitySet = () => {
        onAbilitySet(currentAbilities)
        setAbilityChangesPending(false)
    }

    const handleAuraSet = () => {
        onAuraSet(currentAuras)
        setAuraChangesPending(false)
    }

    const showAbilityOptions = (e) => {
        const settingKey = e.target.getAttribute("setting")
        setActiveAbilitySection(settingKey)
    }

    const showAuraOptions = (e) => {
        const settingKey = e.target.getAttribute("setting")
        setActiveAuraSection(settingKey)
    }

    const reset = () => {
        setCurrentAuras(auras)
        setCurrentAbilities(abilities)
        setAbilityChangesPending(false)
        setAuraChangesPending(false)
        setTimeout(() => {
            setActiveAbilitySection(null)
            setActiveAuraSection(null)
        }, 500)
    }

    return (
        <Panel panel={panel} currentPanel={currentPanel} reset={reset} onClick={onClick} handleClose={closePanel} header={header} panelClass={panelClass} style={{transform: `translateX(${currentPanel === panel ? "0px": "350px"}`}}>
            <div className="vertical-panel-content">
                <div className="panel-content-container">
                    <div className="panel-content-header">Customize Abilities</div>
                    <div className="settings-header-container">
                        {Object.keys(abilities)
                        .filter(k => abilityOptions[k])
                        .map(k => 
                            <div key={k} className={activeAbilitySection === k ? "settings-header-active" : "settings-header"} setting={k} onClick={showAbilityOptions}>{abilities[k].displayName}</div>    
                        )}
                    </div>
                    {activeAbilitySection ? <CustomizeSection name={activeAbilitySection} setting={currentAbilities[activeAbilitySection]} options={abilityOptions[activeAbilitySection]} onChange={handleAbilitySettingChange}/> : null}
                    <div className="panel-text-button-container">
                        <div className="panel-info-text-container">
                            {abilityChangesPending ? changesPendingText : null}
                        </div>                  
                        <div>
                            <button className="panel-button" onClick={handleAbilitySet}>{abilityButtonText}</button>
                        </div>
                    </div>
                </div>
                <div className="panel-content-container">
                    <div className="panel-content-header">Customize Auras</div>
                        <div className="settings-header-container">
                            {Object.keys(auras)
                            .filter(k => auraOptions[k])
                            .map(k => 
                                <div key={k} className={activeAuraSection === k ? "settings-header-active" : "settings-header"} setting={k} onClick={showAuraOptions}>{auras[k].displayName}</div>    
                            )}
                        </div>
                        {activeAuraSection ? <CustomizeSection name={activeAuraSection} setting={currentAuras[activeAuraSection]} options={auraOptions[activeAuraSection]} onChange={handleAuraSettingChange}/> : null}
                        <div className="panel-text-button-container">
                            <div className="panel-info-text-container">
                                {auraChangesPending ? changesPendingText : null}    
                            </div>
                            <div>
                                <button className="panel-button" onClick={handleAuraSet}>{auraButtonText}</button>   
                            </div>  
                        </div>            
                </div>
            </div>
        </Panel>      
    )
}

export default SettingsPanel