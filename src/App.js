import React, {useState, useReducer} from 'react';
import './App.css';
import ResourceBar from "./components/ResourceBar"
import AbilityBar from "./components/AbilityBar"
import Voidform from "./components/Voidform"
import Timer from './components/Timer';
import ExportPanel from "./components/panels/ExportPanel"
import SettingsPanel from "./components/panels/SettingsPanel"
import AbilityKeybindsPanel from "./components/panels/AbilityKeybindsPanel"
import AboutPanel from "./components/panels/AboutPanel"
import abilities from "./utils/abilityConfig"

const App = () => {

  const defaultState = {
    inVoidform: false,
    resource: 100,
    hasteSources: {
      voidform: 0,
      lingeringInsanity: 0
    },
    stacks: 0
  }

  const [state, updateState] = useReducer((state, action) => {

    let event = action.type
    let newState = JSON.parse(JSON.stringify(state))

    switch(event) {
      case "HASTE_UPDATE":
        const {source, haste} = action.payload
        newState.hasteSources[source] += haste
        break
      case "VOIDFORM_UPDATE":
        newState.stacks++
        newState.hasteSources["voidform"] += action.payload
      case "VOIDFORM_START":
        newState.inVoidform = true
        break;
      case "VOIDFORM_END":
        newState.stacks = 0
        newState.hasteSources["voidform"] = 0
        break;
      case "RESOURCE_UPDATE":
        let resource = Math.max(Math.min(newState.resource + action.payload, 100), 0)
        newState.resource = resource
        if(resource <= 0 && newState.inVoidform) {
          newState.inVoidform = false
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
    return Object.keys(state.hasteSources).reduce((haste, source) => {
      return haste * (1+state.hasteSources[source])
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

    console.log(newSettings)
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello</p>
        {/* <div panel="abilitykeybinds" onClick={handlePanelHeaderClick}>Click to open panel!</div> */}
        <div className ="header-panel"></div>
        <div className="panel-container">
          <SettingsPanel onImport={() => {}} currentPanel={panel} onClick={handlePanelHeaderClick} closePanel={handlePanelClose}/>
          <AbilityKeybindsPanel abilities={abilitySettings} currentPanel={panel} onKeybind={() => {}} onToggle={handleAbilityToggle} onClick={handlePanelHeaderClick} closePanel={handlePanelClose}/>
          <ExportPanel onExport={handleExport} currentPanel={panel} exportData={exportData} onClick={handlePanelHeaderClick} closePanel={handlePanelClose}/>
          <AboutPanel currentPanel={panel} onClick={handlePanelHeaderClick} closePanel={handlePanelClose} />
          {/* add about panel that triggers modal*/}
          </div>
        {/* {/* <button onClick={handleClick}>Show Timer!</button> */}
        {/* {showTimer ? <Timer /> : null} */}
        {/* <input type="image" src="images/void-bolt.jpg" /> */}
        {/* {Object.keys(abilities).map(k => {
          //let ability = abilities[k]
          return <ProgressAbility radius={100} stroke={100} progress={progress} icon={k} />
        }) */}
        {state.inVoidform ? <Voidform drainRate={drainRate} drainStart={drainStart} stackHaste={stackHaste} baseHaste={baseHaste} maxStacks={maximumVoidformStacks} triggerEvent={updateState}/> : null}
        <ResourceBar current={state.resource} max={100}/>
        <button onClick={enterVoidform}>Enter Voidform!</button>
        <button onClick={gainInsanity}>+10 Insanity</button>
        <div>{state.inVoidform ? "Voidform Stacks: " + state.stacks : ""}</div>
        <AbilityBar abilitySettings={abilitySettings} haste={calculateHaste()} triggerEvent={updateState}/>
         {/* <StaticProgressAbility /> */}
      </header>
    </div>
  );
}

export default App;
