import React, {useState, useReducer} from 'react';
import './App.css';
import ResourceBar from "./components/ResourceBar"
import AbilityBar from "./components/AbilityBar"
import AuraBar from "./components/auras/AuraBar"
import ExportPanel from "./components/panels/ExportPanel"
import SettingsPanel from "./components/panels/SettingsPanel"
import AbilityKeybindsPanel from "./components/panels/AbilityKeybindsPanel"
import AboutPanel from "./components/panels/AboutPanel"
import abilities from "./utils/abilityConfig"

const App = () => {

  const defaultState = {
    resource: 100,
    auras: {
      voidform: {
        active: false,
        stacks: 0,
        haste: 0
      },
      lingeringInsanity: {
        active: false,
        stacks: 0,
        haste: 0
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
        const {source, haste} = action.payload
        newState.auras[source].haste += haste
        break
      case "VOIDFORM_UPDATE":
        voidform.stacks++
        voidform.haste += action.payload
        break;
      case "VOIDFORM_START":
        voidform.active = true
        break;
      case "VOIDFORM_END":
        lingeringInsanity.active = true
        lingeringInsanity.stacks = voidform.stacks
        lingeringInsanity.haste = voidform.haste
        voidform.stacks = 0
        voidform.haste = 0
        break;
      case "LINGERING_INSANITY_START":
        lingeringInsanity.haste = action.payload
        break;
      case "LINGERING_INSANITY_UPDATE":
        lingeringInsanity.haste += action.payload
        lingeringInsanity.stacks--
        break;
      case "LINGERING_INSANITY_END":
        lingeringInsanity.active = false
        break;
      case "RESOURCE_UPDATE":
        let resource = Math.max(Math.min(newState.resource + action.payload, 100), 0)
        newState.resource = resource
        if(resource <= 0 && voidform.active) {
          voidform.active = false
        }
        break;
    }

    return newState
  }, defaultState)

  const drainRate = 1
  const drainStart = 10
  const stackHaste = .02
  const baseHaste = .5
  const maximumVoidformStacks = 10

  const [showTimer, setShowTimer] = useState(false)
  const [exportData, setExportData] = useState("")
  const [panel, setPanel] = useState()
  const [abilitySettings, setAbilitySettings] = useState(abilities)

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
      console.log(aura)
      console.log(auras[aura])
      return haste * (1+auras[aura].haste)
    }, 1)
  }

  const handleClick = () => {
    setShowTimer(!showTimer)
  }

  const handleExport = () => {
    setExportData("Hello")
  }

  const handlePanelHeaderClick = (panel) => {
    setPanel(panel)
  }

  const handlePanelClose = () => {
    setPanel(null)
  }

  const handleAbilityToggle = (ability) => {
    let newSettings = JSON.parse(JSON.stringify(abilitySettings))

    newSettings[ability].disabled = !newSettings[ability].disabled

    setAbilitySettings(newSettings)
  }

  const lingeringInsanitySettings = {
    duration: 10000,
    hasteRetention: 1,
    afterVoidformEntry: true
  }

  const auraSettings = {
    lingeringInsanitySettings
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello</p>
        <div className ="header-panel"></div>
        <div className="panel-container">
          <SettingsPanel onImport={() => {}} currentPanel={panel} onClick={handlePanelHeaderClick} closePanel={handlePanelClose}/>
          <AbilityKeybindsPanel abilities={abilitySettings} currentPanel={panel} onKeybind={() => {}} onToggle={handleAbilityToggle} onClick={handlePanelHeaderClick} closePanel={handlePanelClose}/>
          <ExportPanel onExport={handleExport} currentPanel={panel} onClick={handlePanelHeaderClick} closePanel={handlePanelClose}/>
          <AboutPanel currentPanel={panel} onClick={handlePanelHeaderClick} closePanel={handlePanelClose} />
        </div>
        <AuraBar auras={state.auras} settings={auraSettings} triggerEvent={updateState} />
        <ResourceBar current={state.resource} max={100}/>
        <button onClick={enterVoidform}>Enter Voidform!</button>
        <button onClick={gainInsanity}>+10 Insanity</button>
        <AbilityBar abilitySettings={abilitySettings} haste={calculateHaste()} triggerEvent={updateState}/>
      </header>
    </div>
  );
}

export default App;
