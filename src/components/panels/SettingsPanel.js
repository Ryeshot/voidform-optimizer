import React, {useState, useEffect, useReducer, useRef} from 'react';
import Panel from "./Panel"
import CustomizeSection from "./CustomizeSection"

import "./Panel.css"

const SettingsPanel = (props) => {

    const {settings, currentPanel, onAbilitySet, onAuraSet, onClick, closePanel, onPause} = props

    const {abilities, auras} = settings

    const panel = "settings"
    const header= "Custom Settings"
    const panelClass = "right-panel"

    const [currentAbilities, setCurrentAbilities] = useState(abilities)
    const [currentAuras, setCurrentAuras] = useState(auras)
    const [activeAbilitySection, setActiveAbilitySection] = useState("")
    const [activeAuraSection, setActiveAuraSection] = useState("")

    const handleAbilitySettingChange = (setting, key) => {
        const newAbilities = JSON.parse(JSON.stringify(currentAbilities))
        newAbilities[key] = setting
        setCurrentAbilities(newAbilities)
        //console.log(newAbilities)
    }

    const handleAuraSettingChange = (setting, key) => {
        const newAuras = JSON.parse(JSON.stringify(currentAuras))
        newAuras[key] = setting
        setCurrentAuras(newAuras)
    }

    const handleAbilitySet = () => {
        onAbilitySet(currentAbilities)
        //console.log(currentAbilities)
        onPause(false)
    }

    const handleAuraSet = () => {
        onAuraSet(currentAuras)
        onPause(false)
    }

    const showAbilityOptions = (e) => {
        onPause(true)
        const settingKey = e.target.getAttribute("setting")
        setActiveAbilitySection(settingKey)
    }

    const showAuraOptions = (e) => {
        onPause(true)
        const settingKey = e.target.getAttribute("setting")
        setActiveAuraSection(settingKey)
    }

    return (
        <Panel panel={panel} onClick={onClick} handleClose={closePanel} header={header} panelClass={panelClass} style={{transform: `translateX(${currentPanel === panel ? "0px": "350px"}`}}>
            <div className="vertical-panel-content">
                <div className="panel-content-container">
                    <div className="panel-content-header">Customize Abilities</div>
                    <div className="settings-header-container">
                        {Object.keys(abilities).map(k => 
                            <div className={activeAbilitySection === k ? "settings-header-active" : "settings-header"} setting={k} onClick={showAbilityOptions}>{k}</div>    
                        )}
                    </div>
                    {activeAbilitySection ? <CustomizeSection name={activeAbilitySection} setting={currentAbilities[activeAbilitySection]} onChange={handleAbilitySettingChange}/> : null}
                    <button className="panel-button" onClick={handleAbilitySet}>Apply</button>
                </div>
                <div className="panel-content-container">
                    <div className="panel-content-header">Customize Auras</div>
                        <div className="settings-header-container">
                            {Object.keys(auras).map(k => 
                                <div className={activeAuraSection === k ? "settings-header-active" : "settings-header"} setting={k} onClick={showAuraOptions}>{k}</div>    
                            )}
                        </div>
                        {activeAuraSection ? <CustomizeSection name={activeAuraSection} setting={currentAuras[activeAuraSection]} onChange={handleAuraSettingChange}/> : null}
                        <button className="panel-button" onClick={handleAuraSet}>Apply</button>                 
                </div>
            </div>
        </Panel>      
    )
}

export default SettingsPanel