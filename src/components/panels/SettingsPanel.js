import React, {useState, useEffect, useReducer, useRef} from 'react';
import Panel from "./Panel"
import CustomizeSection from "./CustomizeSection"
import {abilityOptions, auraOptions} from "../../lib/options"
import "./Panel.css"

const SettingsPanel = (props) => {

    const {settings, currentPanel, onAbilitySet, onAuraSet, onClick, closePanel} = props

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
    const [activeAbilitySection, setActiveAbilitySection] = useState(Object.keys(abilities)[0])
    const [activeAuraSection, setActiveAuraSection] = useState(Object.keys(auras)[0])
    const [abilityChangesPending, setAbilityChangesPending] = useState(false)
    const [auraChangesPending, setAuraChangesPending] = useState(false)

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
        setActiveAbilitySection(Object.keys(abilities)[0])
        setActiveAuraSection(Object.keys(auras)[0])
        setCurrentAuras(auras)
        setCurrentAbilities(abilities)
        setAbilityChangesPending(false)
        setAuraChangesPending(false)
    }

    return (
        <Panel panel={panel} currentPanel={currentPanel} reset={reset} onClick={onClick} handleClose={closePanel} header={header} panelClass={panelClass} style={{transform: `translateX(${currentPanel === panel ? "0px": "350px"}`}}>
            <div className="vertical-panel-content">
                <div className="panel-content-container">
                    <div className="panel-content-header">Customize Abilities</div>
                    <div className="settings-header-container">
                        {Object.keys(abilities).map(k => 
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
                            {Object.keys(auras).map(k => 
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