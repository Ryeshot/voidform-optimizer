import React, {useState, useReducer} from 'react';
import './App.css';
import ResourceBar from "./components/ResourceBar"
import AbilityBar from "./components/AbilityBar"
import AuraBar from "./components/auras/AuraBar"
import ExportPanel from "./components/panels/ExportPanel"
import SettingsPanel from "./components/panels/SettingsPanel"
import AbilityKeybindsPanel from "./components/panels/AbilityKeybindsPanel"
import AboutPanel from "./components/panels/AboutPanel"
import defaultAbilities from "./utils/abilityConfig"
import defaultAbilitySettings from "./utils/abilities"

const App = () => {

  const defaultState = {
    resource: 100,
    canEnterVoidform: false,
    auras: {
      voidform: {
        active: false,
        stacks: 0,
        haste: 0,
        paused: false,
      },
      lingeringInsanity: {
        active: false,
        stacks: 0,
        haste: 0
      }
    },
    abilities: {
      "void-eruption": {
        unusable: true
      }
    }
  }

  const [state, updateState] = useReducer((state, action) => {

    let event = action.type
    let newState = JSON.parse(JSON.stringify(state))

    const voidform = newState.auras.voidform
    const lingeringInsanity = newState.auras.lingeringInsanity

    switch(event) {
      case "HASTE_UPDATE":
        var {source, haste} = action.payload
        newState.auras[source].haste += haste
        break
      case "VOIDFORM_UPDATE":
        voidform.stacks++
        voidform.haste += action.payload
        break;
      case "VOIDFORM_START":
        voidform.active = true
        voidform.stacks = 1
        break;
      case "VOIDFORM_END":
        lingeringInsanity.active = true
        lingeringInsanity.stacks = voidform.stacks
        lingeringInsanity.haste = voidform.haste
        lingeringInsanity.startTime = action.payload
        voidform.stacks = 0
        voidform.haste = 0
        break;
      case "LINGERING_INSANITY_START":
        var {haste, stacks} = action.payload
        lingeringInsanity.haste = haste
        lingeringInsanity.stacks = stacks
        break;
      case "LINGERING_INSANITY_UPDATE":
        lingeringInsanity.haste += action.payload
        lingeringInsanity.stacks--
        break;
      case "LINGERING_INSANITY_END":
        lingeringInsanity.active = false
        lingeringInsanity.stacks = 0
        lingeringInsanity.haste = 0
        lingeringInsanity.startTime = 0
        break;
      case "RESOURCE_UPDATE":
        let resource = Math.max(Math.min(newState.resource + action.payload.resource, 100), 0)
        newState.resource = resource
        if(resource <= 0 && voidform.active) {
          voidform.active = false
        }
        if(!voidform.active && resource >= 90) {
          newState.abilities["void-eruption"].unusable = false
        }
        break;
      case "INSANITY_DRAIN_PAUSE_START":
        voidform.paused = true
        break
      case "INSANITY_DRAIN_PAUSE_END":
        voidform.paused = false
        break
    }

    return newState
  }, defaultState)

  const [showTimer, setShowTimer] = useState(false)
  const [exportData, setExportData] = useState("")
  const [panel, setPanel] = useState()
  const [abilitySettings, setAbilitySettings] = useState(defaultAbilitySettings)
  const [abilities, setAbilities] = useState(defaultAbilities)

  const enterVoidform = () => {
    updateState({
      type: "VOIDFORM_START"
    })
  }

  const gainInsanity = () => {
    updateState({
      type: "RESOURCE_UPDATE",
      payload: 10
    })
  }

  const calculateHaste = () => {
    const auras = state.auras
    return Object.keys(auras).reduce((haste, aura) => {
      return haste * (1+auras[aura].haste)
    }, 1)
  }

  const handlePanelHeaderClick = (panel) => {
    setPanel(panel)
  }

  const handlePanelClose = () => {
    setPanel(null)
  }

  const handleAbilityToggle = (ability) => {
    let newSettings = JSON.parse(JSON.stringify(abilities))

    newSettings[ability].disabled = !newSettings[ability].disabled
    if(ability === "void-bolt") newSettings["void-eruption"].disabled = newSettings[ability].disabled

    setAbilities(newSettings)
  }

  const handleExport = () => {
    setExportData("Hello")
  }

  const lingeringInsanitySettings = {
    type: "static"
    // rate: 3000,
    // hasteDecay: 0,
  }

  const auraSettings = {
    lingeringInsanitySettings
  }

  const merge = () => {
    return Object.keys(abilities).reduce((merged, a) => {
      merged[a] = {...abilities[a], ...state.abilities[a]}
      return merged
    }, {})
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello</p>
        <div className ="header-panel"></div>
        <div className="panel-container">
          <SettingsPanel onImport={() => {}} currentPanel={panel} onClick={handlePanelHeaderClick} closePanel={handlePanelClose}/>
          <AbilityKeybindsPanel abilities={abilities} currentPanel={panel} onKeybind={() => {}} onToggle={handleAbilityToggle} onClick={handlePanelHeaderClick} closePanel={handlePanelClose}/>
          <ExportPanel onExport={handleExport} currentPanel={panel} onClick={handlePanelHeaderClick} closePanel={handlePanelClose}/>
          <AboutPanel currentPanel={panel} onClick={handlePanelHeaderClick} closePanel={handlePanelClose} />
        </div>
        <div id="main-bar-container">
          <AuraBar auras={state.auras} settings={auraSettings} triggerEvent={updateState} />
          <ResourceBar current={state.resource} max={100}/>
          <button onClick={enterVoidform}>Enter Voidform!</button>
          <button onClick={gainInsanity}>+10 Insanity</button>
          <AbilityBar abilitySettings={abilitySettings} abilities={merge()} haste={calculateHaste()} inVoidform={state.auras.voidform.active} triggerEvent={updateState}/>
          <div>Haste: {((calculateHaste()-1)*100).toFixed(2)}%</div>
        </div>
        
      </header>
    </div>
  );
}

export default App;
