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

    const [currentAbilities, setCurrentAbilities] = useState()
    const [currentAuras, setCurrentAuras] = useState()
    const [activeAbilitySection, setActiveAbilitySection] = useState()
    const [activeAuraSection, setActiveAuraSection] = useState()

    useEffect(() => {
        reset()
    }, [currentPanel])

    const handleAbilitySettingChange = (setting, key) => {
        //const newAbilities = JSON.parse(JSON.stringify(currentAbilities))
        //newAbilities[key] = setting
        const newAbilities = {...currentAbilities, [key]: setting}
        setCurrentAbilities(newAbilities)
    }

    const handleAuraSettingChange = (setting, key) => {
        const newAuras = {...currentAuras, [key]: setting}
        //const newAuras = JSON.parse(JSON.stringify(currentAuras))
        //newAuras[key] = setting
        setCurrentAuras(newAuras)
    }

    const handleAbilitySet = () => {
        onAbilitySet(currentAbilities)
    }

    const handleAuraSet = () => {
        onAuraSet(currentAuras)
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
    }

    return (
        <Panel panel={panel} onClick={onClick} handleClose={closePanel} header={header} panelClass={panelClass} style={{transform: `translateX(${currentPanel === panel ? "0px": "350px"}`}}>
            <div className="vertical-panel-content">
                <div className="panel-content-container">
                    <div className="panel-content-header">Customize Abilities</div>
                    <div className="settings-header-container">
                        {Object.keys(abilities).map(k => 
                            <div key={k} className={activeAbilitySection === k ? "settings-header-active" : "settings-header"} setting={k} onClick={showAbilityOptions}>{abilities[k].displayName}</div>    
                        )}
                    </div>
                    {activeAbilitySection ? <CustomizeSection name={activeAbilitySection} setting={currentAbilities[activeAbilitySection]} options={abilityOptions[activeAbilitySection]} onChange={handleAbilitySettingChange}/> : null}
                    <button className="panel-button" onClick={handleAbilitySet}>Apply</button>
                </div>
                <div className="panel-content-container">
                    <div className="panel-content-header">Customize Auras</div>
                        <div className="settings-header-container">
                            {Object.keys(auras).map(k => 
                                <div key={k} className={activeAuraSection === k ? "settings-header-active" : "settings-header"} setting={k} onClick={showAuraOptions}>{auras[k].displayName}</div>    
                            )}
                        </div>
                        {activeAuraSection ? <CustomizeSection name={activeAuraSection} setting={currentAuras[activeAuraSection]} options={auraOptions[activeAuraSection]} onChange={handleAuraSettingChange}/> : null}
                        <button className="panel-button" onClick={handleAuraSet}>Apply</button>                 
                </div>
            </div>
        </Panel>      
    )
}

export default SettingsPanel