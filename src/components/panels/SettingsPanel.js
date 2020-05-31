import React, {useState, useEffect, useReducer, useRef} from 'react';
import Panel from "./Panel"
import CustomizeSection from "./CustomizeSection"

import "./Panel.css"

const SettingsPanel = (props) => {

    const {settings, currentPanel, onAbilitySet, onAuraSet, onClick, closePanel} = props

    const {abilities, auras} = settings

    console.log(abilities)
    console.log(auras)

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
    }

    const handleAuraSettingChange = (setting, key) => {
        const newAuras = JSON.parse(JSON.stringify(currentAuras))
        newAuras[key] = setting
        setCurrentAuras(newAuras)
    }

    const handleAbilitySet = () => {
        onAbilitySet(currentAbilities)
    }

    const handleAuraSet = () => {
        onAuraSet(currentAuras)
    }

    return (
        <Panel panel={panel} onClick={onClick} handleClose={closePanel} header={header} panelClass={panelClass} style={{transform: `translateX(${currentPanel === panel ? "0px": "350px"}`}}>
            <div className="vertical-panel-content">
                <div className="panel-content-container">
                    <div className="panel-content-header">Customize Abilities</div>
                    <div>
                        {Object.keys(abilities).map(k => 
                            <div>{k}</div>    
                        )}
                    </div>
                    {activeAbilitySection ? <CustomizeSection key={activeAbilitySection} ability={currentAbilities[activeAbilitySection]} onChange={handleAbilitySettingChange}/> : null}
                    <button className="panel-button" onClick={handleAbilitySet}>Apply</button>
                </div>
                <div className="panel-content-container">
                    <div className="panel-content-header">Customize Auras</div>
                        <div>
                            {Object.keys(auras).map(k => 
                                <div>{k}</div>    
                            )}
                        </div>
                        {activeAuraSection ? <CustomizeSection key={activeAuraSection} ability={currentAuras[activeAuraSection]} onChange={handleAuraSettingChange}/> : null}
                        <button className="panel-button" onClick={handleAuraSet}>Apply</button>                 
                </div>
            </div>
        </Panel>      
    )
}

export default SettingsPanel