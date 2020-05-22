import React, {useState, useReducer} from 'react';
import './App.css';
import ResourceBar from "./components/ResourceBar"
import AbilityBar from "./components/AbilityBar"
import Voidform from "./components/Voidform"

const App = () => {

  const defaultState = {
    inVoidform: false,
    resource: 100
  }

  const [state, updateState] = useReducer((state, action) => {

    let event = action.type
    let newState = {...state}

    switch(event) {
      case "HASTE_UPDATE":
        newState.haste = newState.haste + action.payload
        break
      case "VOIDFORM_START":
        newState.inVoidform = true
        break;
      // case "VOIDFORM_END":
      //   newState.inVoidform = false
      //   break;
      case "RESOURCE_UPDATE":
        let resource = Math.max(Math.min(newState.resource + action.payload, 100), 0)
        newState.resource = resource
        if(resource <= 0) newState.inVoidform = false
        break;
    }

    return newState
  }, defaultState)

  const drainRate = .7
  const drainStart = 6

  const enterVoidform = () => {
    updateState({
      type: "VOIDFORM_START"
    })
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
        {state.inVoidform ? <Voidform drainRate={drainRate} drainStart={drainStart} triggerEvent={updateState}/> : null}
        <ResourceBar current={state.resource} max={100}/>
        <button onClick={enterVoidform}>Click Me!</button>
        <AbilityBar haste={state.haste} triggerEvent={updateState}/>
         {/* <StaticProgressAbility /> */}
      </header>
    </div>
  );
}

export default App;
