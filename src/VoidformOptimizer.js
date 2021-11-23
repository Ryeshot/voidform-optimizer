import React, {useState, useEffect, useReducer} from 'react';
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
import Forms from "./components/forms/Forms"
import {DesignPhilosophyLink as DesignPhilosophy} from "./components/articles/DesignPhilosophy"
import {RampLink as Ramp} from "./components/articles/Ramp"
import templates from "./lib/templates"

const handleDotRefresh = {
  pandemic: (aura, { baseDuration }, { time }) => {
    const now = time
    const endTime = aura.startTime + aura.maxDuration
    const remaining = endTime - now
    const pandemicDuration = Math.min(.3 * baseDuration, remaining)

    aura.maxDuration = baseDuration + pandemicDuration
    aura.startTime = now
  },
  rolling: (aura, { baseDuration }, { time }) => {
    const now = time
    const timeToNextTick = aura.tickTime - now
    aura.maxDuration = baseDuration + timeToNextTick
    aura.startTime = now
  }
}

const defaultState = {
  resource: 0,
  auras: {
    stats: {
      haste: 0
    },
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
    },
    "shadow-word-pain": {
      active: false
    },
    "vampiric-touch": {
      active: false
    },
    "devouring-plague": {
      active: false
    },
    "shadowfiend": {
      active: false
    },
    "power-infusion": {
      active: false,
      haste: 0
    },
    "bloodlust": {
      active: false,
      haste: 0
    }
  },
  abilities: {
    "void-eruption": {
      unusable: true
    },
    "devouring-plague": {
      unusable: true
    },
    "void-torrent": {
      unusable: defaultAbilitySettings["void-torrent"].requireVoidform
    }
  }
}

const VoidformOptimizer = () => {

  const [panel, setPanel] = useState()
  const [abilitySettings, setAbilitySettings] = useState(defaultAbilitySettings)
  const [abilities, setAbilities] = useState(defaultAbilities)
  const [auraSettings, setAuraSettings] = useState(defaultAuraSettings)
  const [keyEventsPaused, setKeyEventsPaused] = useState(false)
  const [reset, setReset] = useState(false)
  const [abilityReset, setAbilityReset] = useState(false)
  const [haste, setHaste] = useState(0)

  const [state, updateState] = useReducer((state, action) => {

    let event = action.type
    let newState = JSON.parse(JSON.stringify(state))

    const voidform = newState.auras.voidform
    const lingeringInsanity = newState.auras.lingeringInsanity
    const powerInfusion = newState.auras["power-infusion"]
    const voidformAbilities = ["void-torrent", "devouring-plague"]

    switch(event) {
      case "RESET":
        return {...defaultState, resource: auraSettings.stats.startingInsanity }
      case "RESET_ABILITIES":
        return {...defaultState, resource: auraSettings.stats.startingInsanity, auras: state.auras}
      case "RESET_AURAS":
        return {...newState, resource: auraSettings.stats.startingInsanity, auras: {...defaultState.auras, stats: state.auras.stats} }
      case "UPDATE_ABILITY_STATE":
        // voidformAbilities.forEach(k => {
        //   const setting = abilitySettings[k]
        //   newState.abilities[k].unusable = !!setting.requireVoidform
        // })
        break
      case "HASTE_SET":
        var {source, haste} = action.payload
        newState.auras[source].haste = haste
        break
      case "HASTE_UPDATE":
        var {source, haste} = action.payload
        newState.auras[source].haste += haste
        break
      case "HASTE_RESET":
        var {source} = action.payload
        newState.auras[source].haste = 0
        break
      case "VOIDFORM_UPDATE":
        voidform.stacks++
        voidform.haste += action.payload
        break;
      case "VOIDFORM_START":
        voidform.active = true
        voidform.stacks = 1
        voidformAbilities.forEach(k => {
          const setting = abilitySettings[k]
          newState.abilities[k].unusable = !!setting.requireNoVoidform
        })
        break;
      case "VOIDFORM_END":
        var {time, startingHaste} = action.payload
        lingeringInsanity.active = true
        lingeringInsanity.stacks = voidform.stacks
        lingeringInsanity.haste = Math.round((voidform.haste - startingHaste)*1000)/1000
        lingeringInsanity.startTime = time
        voidform.stacks = 0
        voidform.haste = 0
        newState.abilities["void-eruption"].unusable = true
        voidformAbilities.forEach(k => {
          const setting = abilitySettings[k]
          newState.abilities[k].unusable = !setting.requireNoVoidform || !!setting.requireVoidform
        })
        break;
      case "LINGERING_INSANITY_START":
        var {haste, stacks} = action.payload
        lingeringInsanity.haste = haste
        lingeringInsanity.stacks = stacks
        break;
      case "LINGERING_INSANITY_UPDATE":
        lingeringInsanity.haste += action.payload
        lingeringInsanity.stacks--
        if(lingeringInsanity.haste <= 0) lingeringInsanity.haste = 0
        break;
      case "LINGERING_INSANITY_END":
        lingeringInsanity.active = false
        lingeringInsanity.stacks = 0
        lingeringInsanity.haste = 0
        lingeringInsanity.startTime = 0
        break;
      case "RESOURCE_UPDATE":
        var {name, resource, resourceCost, costType} = action.payload
        let targetCount = name === "mind-sear" ? abilitySettings[name].targetCount : 1

        resourceCost = resourceCost || 0

        resource = (resource + (resourceCost * -1)) * targetCount

        if(voidform.active && !auraSettings.voidform.gainInsanity && resource > 0)
          resource = 0

        if(costType && costType === "dump") {
          resource = 0
          newState.resource = 0
        }

        if(powerInfusion.active && resource > 0)
          resource += (resource * auraSettings["power-infusion"].resourceGen)

        resource = Math.max(Math.min(newState.resource + resource, 100), 0)
        newState.resource = resource
        if(resource <= 0 && voidform.active && auraSettings.voidform.type === "insanity") {
          voidform.active = false
        }
        //whenever we get resource need to calculate if an ability is usable or not
        Object.keys(abilitySettings).forEach(k => {
          const setting = abilitySettings[k]
          const ability = newState.abilities[k]
          const unusable = (voidform.active && !!setting.requireNoVoidform) || (!voidform.active && !!setting.requireVoidform)
          
          if(!ability) return
          if(!setting.resourceCost) {
            ability.unusable = unusable
            return
          }
          if(setting.costType === "dump") 
            ability.unusable = resource === 0 || unusable
          else {
            ability.unusable = resource < setting.resourceCost || unusable
          }
        })
        break;
      case "INSANITY_DRAIN_PAUSE_START":
        voidform.paused = true
        break
      case "INSANITY_DRAIN_PAUSE_END":
        voidform.paused = false
        break
      case "AURA_START":
        var {name, time} = action.payload
        var aura = newState.auras[name]

        const type = auraSettings[name].type;
        //handle pandemic or rolling
        (aura.active && type) ? handleDotRefresh[type](aura, auraSettings[name], action.payload) : aura.active = true
        break
      case "AURA_BEGIN":
        var {name, time, duration, tickTime} = action.payload
        newState.auras[name].startTime = time
        newState.auras[name].maxDuration = duration
        newState.auras[name].tickTime = tickTime
        break
      case "AURA_REFRESH":
        var {name, time} = action.payload
        newState.auras[name].startTime = time
        break
      case "AURA_TICK":
        var {name, tickTime} = action.payload
        newState.auras[name].tickTime = tickTime
        break
      case "AURA_END":
        var {name} = action.payload
        newState.auras[name].active = false
        newState.auras[name].startTime = 0
        break
      case "DOT_EXTEND":
        const extension = abilitySettings["void-bolt"].extension
        const dots = ["shadow-word-pain", "vampiric-touch"]
        dots.forEach(d => {
          const dot = newState.auras[d]
          if(!dot.active) return
          dot.maxDuration += extension
        })
        break
    }

    return newState
  }, defaultState)

  useEffect(() => {
    setHaste(calculateHaste)
  }, [state.auras.stats.haste,
    state.auras.voidform.haste,
    state.auras.lingeringInsanity.haste,
    state.auras["power-infusion"].haste,
    state.auras["bloodlust"].haste])

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const template = queryParams.get("template")
    if(!template || !templates[template]) return
    const templateSettings = {...templates[template], abilityConfig: templates[template].abilities}
    delete templateSettings.abilities
    handleImport(templateSettings)
  }, [])

  const enterVoidform = () => {
    updateState({
      type: "VOIDFORM_START"
    })
  }

  const gainInsanity = () => {
    updateState({
      type: "RESOURCE_UPDATE",
      payload: {
        resource: 10
      }
    })
  }

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
    handleReset()
  }

  const setAllAbilities = (importedAbilities) => {
    let state = Object.keys(abilities).reduce((state, ability) => {
      state[ability] = {...abilities[ability], ...importedAbilities[ability]}
      return state
    }, {})

    setAbilities(state)
  }

  const mergeAbilities = () => {
    return Object.keys(abilities).reduce((merged, a) => {
      merged[a] = {...abilities[a], ...state.abilities[a]}
      return merged
    }, {})
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
        type: "LINGERING_INSANITY_END"
      })
      // updateState({
      //   type: "RESOURCE_UPDATE",
      //   payload: {
      //     resource
      //   }
      // })
    }, 0)
  }

  const handleReset = () => {
    handleAuraReset()
    handleAbilityReset()
    setReset(!reset)
  }

  return (
    <div className="App">
      <header className="App-header header-panel">
        <div className="App-title">
          <div className="App-title-text">
            Voidform Optimizer 2.0
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
        <AuraBar auras={state.auras} settings={auraSettings} haste={haste} triggerEvent={updateState} />
        <ResourceBar current={state.resource} max={100}/>
        <AbilityBar abilitySettings={abilitySettings} abilities={mergeAbilities()} haste={haste} inVoidform={state.auras.voidform.active} triggerEvent={updateState} keyEventsPaused={keyEventsPaused} reset={abilityReset} />
        <button className="panel-button" onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}

export default VoidformOptimizer;
