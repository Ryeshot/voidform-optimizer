import React, {useState, useEffect, useReducer, useRef} from 'react';
import './App.css';
import ResourceBar from "./components/ResourceBar"
import AbilityBar from "./components/AbilityBar"
import AuraBar from "./components/auras/AuraBar"
import ExportPanel from "./components/panels/ExportPanel"
import SettingsPanel from "./components/panels/SettingsPanel"
import AbilityKeybindsPanel from "./components/panels/AbilityKeybindsPanel"
import AboutPanel from "./components/panels/AboutPanel"
import WhatsNewPanel from "./components/panels/WhatsNewPanel"
import defaultAbilities from "./lib/abilities"
import defaultAbilitySettings from "./lib/abilitySettings"
import defaultAuraSettings from "./lib/auraSettings"
import defaultEffectSettings from "./lib/effectSettings"
import defaultEffects from "./lib/effects"
import Forms from "./components/forms/Forms"
import {DesignPhilosophyLink as DesignPhilosophy} from "./components/articles/DesignPhilosophy"
import {RampLink as Ramp} from "./components/articles/Ramp"
import rootReducer from "./utils/reducers"
import EffectHandler from "./utils/effectHandler"

const VoidformOptimizer = () => {

  const [panel, setPanel] = useState()
  const [abilitySettings, setAbilitySettings] = useState(defaultAbilitySettings)
  const [abilities, setAbilities] = useState(defaultAbilities)
  const [auraSettings, setAuraSettings] = useState(defaultAuraSettings)
  const [effectSettings, setEffectSettings] = useState(defaultEffectSettings)
  //const [effects, setEffects] = useState(defaultEffects)
  const [keyEventsPaused, setKeyEventsPaused] = useState(false)
  const [reset, setReset] = useState(false)
  const [abilityReset, setAbilityReset] = useState(false)
  const [haste, setHaste] = useState(0)

  const [state, updateState] = useReducer(...rootReducer(auraSettings, abilitySettings, abilities))
  const stateRef = useRef()
  stateRef.current = {...state, abilitySettings, auraSettings, effectSettings}
  const [abilityEffectHandler] = useState(EffectHandler.forAbility(stateRef))
  const [auraEffectHandler] = useState(EffectHandler.forAura(stateRef))

  useEffect(() => {
    setHaste(calculateHaste)
  }, [state.auras.stats.haste,
    state.auras.voidform.haste,
    state.auras.lingeringInsanity.haste,
    state.auras["power-infusion"].haste,
    state.auras["bloodlust"].haste])

  const calculateHaste = () => {
    const auras = state.auras
    return Object.keys(auras).reduce((haste, aura) => {
      if(!auras[aura].haste) return haste
      return haste * (1+auras[aura].haste)
    }, 1)
  }

  const handlePanelHeaderClick = (panel) => {
    setKeyEventsPaused(true)
    setPanel(panel)
  }

  const handlePanelClose = () => {
    setKeyEventsPaused(false)
    setPanel(null)
  }

  const handleAbilityToggle = (ability) => {
    let newSettings = JSON.parse(JSON.stringify(abilities))

    newSettings[ability].disabled = !newSettings[ability].disabled
    if(ability === "void-bolt") newSettings["void-eruption"].disabled = newSettings[ability].disabled

    setAbilities(newSettings)
  }

  const setKeyBind = (keybind, ability) => {
    let state = JSON.parse(JSON.stringify(abilities))
    let key = keybind.key
    let voidBoltOrEruption = ability === "void-bolt" || ability === "void-eruption"
    Object.keys(state).forEach(k => {
      let abilityKeybind = state[k].keybind
      if(abilityKeybind.key === key) state[k].keybind = { keybindText: "--"}
    })
    if(voidBoltOrEruption) {
      state["void-bolt"].keybind = {...keybind}
      state["void-eruption"].keybind = {...keybind}
    }
    else {
      state[ability].keybind = {...keybind}
    }

    setAbilities(state)
  }

  const setAbilityOrder = (index, name) => {
    const state = JSON.parse(JSON.stringify(abilities))
    const ability = state[name]
    const abilityIndex = ability.index
    const shift = index < abilityIndex ? "right" : "left"

    let voidBoltOrEruption = name === "void-bolt" || name === "void-eruption"

    Object.keys(state).forEach(k => {
      const currentIndex = state[k].index

      if(shift === "right" && (currentIndex >= index && currentIndex < abilityIndex)) state[k].index++
      if(shift === "left" && (currentIndex <= index && currentIndex > abilityIndex)) state[k].index--
    })
    
    if(voidBoltOrEruption) {
      state["void-bolt"].index = index
      state["void-eruption"].index = index
    }
    else {
      ability.index = index
    }

    setAbilities(state)
  }

  const handleImport = (settings) => {
    setAllAbilities(settings.abilityConfig)
    handleAbilitySet(settings.abilitySettings)
    handleAuraSet(settings.auraSettings)
    handleEffectSet(settings.effectSettings)
    //handleReset()
  }

  const setAllAbilities = (importedAbilities) => {
    let state = Object.keys(abilities).reduce((state, ability) => {
      state[ability] = {...abilities[ability], ...importedAbilities[ability]}
      return state
    }, {})

    setAbilities(state)
  }

  const abilitySettingsWithDisplayName = () => {
    return Object.keys(abilitySettings).reduce((merged, a) => {
      merged[a] = {...abilitySettings[a], displayName: defaultAbilities[a].displayName}
      return merged
    }, {}) 
  }

  const handleAuraSet = (auraSettings) => {
    setAuraSettings(auraSettings)
    const haste = auraSettings.stats.haste
    const resource = auraSettings.stats.startingInsanity
    handleAuraReset(resource)
    updateState({
      category: "STAT",
      type: "HASTE_SET",
      payload: {
        source: "stats",
        haste
      }
    })
  }

  const handleAbilitySet = (abilitySettings) => {
    setAbilitySettings(abilitySettings)
    handleAbilityReset()
  }

  const handleEffectSet = (effectSettings) => {
    setEffectSettings(effectSettings)
    handleEffectReset()
  }

  const handleAbilityReset = () => {
    updateState({
      type: "RESET_ABILITIES"
    })
    updateState({
      type: "RESOURCE_UPDATE",
      payload: {
        resource: 0
      }
    })
    setAbilityReset(!abilityReset)
  }

  const handleAuraReset = () => {
    updateState({
      type: "RESET_AURAS"
    })

    setTimeout(() => {
      updateState({
        category: "AURA",
        type: "LINGERING_INSANITY_END"
      })
    }, 0)
  }

  const handleEffectReset = () => {
    updateState({
      type: "RESET_EFFECTS"
    })
  }

  const handleReset = () => {
    handleAuraReset()
    handleAbilityReset()
    handleEffectReset()
    setReset(!reset)
  }

  return (
    <div className="App">
      <header className="App-header header-panel">
        <div className="App-title">
          <div className="App-title-text">
            Voidform Optimizer
          </div>
        </div>
        <div className="header-container">
          <div className="panel-container">
            <SettingsPanel settings={{abilities: abilitySettingsWithDisplayName(), auras: auraSettings}} didReset={reset} onAbilitySet={handleAbilitySet} onAuraSet={handleAuraSet} currentPanel={panel} onClick={handlePanelHeaderClick} closePanel={handlePanelClose} />
            <AbilityKeybindsPanel abilities={abilities} currentPanel={panel} onKeybind={setKeyBind} setOrder={setAbilityOrder} onToggle={handleAbilityToggle} onClick={handlePanelHeaderClick} closePanel={handlePanelClose} />
            <ExportPanel settings={{abilitySettings, auraSettings, abilities}} onImport={handleImport} currentPanel={panel} onClick={handlePanelHeaderClick} closePanel={handlePanelClose}/>
            <AboutPanel currentPanel={panel} onClick={handlePanelHeaderClick} closePanel={handlePanelClose} />
            <WhatsNewPanel />
          </div>
          <div className="panel-container">
            <DesignPhilosophy />
            <Ramp />
          </div>
        </div>
        <Forms pauseKeyEvents={setKeyEventsPaused} />
      </header>
      <div className="App-content">
        <AuraBar auras={state.auras} settings={auraSettings} effectHandler={auraEffectHandler} haste={haste} triggerEvent={updateState} />
        <ResourceBar current={state.resource} max={100}/>
        <AbilityBar state={state.abilities} abilitySettings={abilitySettings} abilities={abilities} effectHandler={abilityEffectHandler} haste={haste} inVoidform={state.auras.voidform.active} dispatch={updateState} keyEventsPaused={keyEventsPaused} reset={abilityReset} />
        <button className="panel-button" onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}

export default VoidformOptimizer;
