import React, {useState, useReducer} from 'react';
import './App.css';
import ResourceBar from "./components/ResourceBar"
import AbilityBar from "./components/AbilityBar"
import Voidform from "./components/Voidform"

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

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello</p>
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
        <AbilityBar haste={calculateHaste()} triggerEvent={updateState}/>
         {/* <StaticProgressAbility /> */}
      </header>
    </div>
  );
}

export default App;
