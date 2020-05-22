import React, {useState, useReducer} from 'react';
import './App.css';
import AbilityBar from "./components/AbilityBar"
import Voidform from "./components/Voidform"
import Timer from "./components/Timer"
import Increment from "./components/Increment"

const App = () => {

  const defaultState = {
    inVoidform: false,
    resource: 100,
    haste: 0,
    stacks: 0
  }

  const [speed, setSpeed] = useState(1)

  const [state, updateState] = useReducer((state, action) => {

    let event = action.type
    let newState = {...state}

    switch(event) {
      case "HASTE_UPDATE":
        newState.haste = newState.haste + action.payload
        break
      case "VOIDFORM_UPDATE":
        newState.stacks++
        newState.haste = newState.haste + action.payload
      case "VOIDFORM_START":
        newState.inVoidform = true
        break;
      case "VOIDFORM_END":
        newState.inVoidform = false
        break;
      case "RESOURCE_UPDATE":
        let resource = Math.max(Math.min(newState.resource + action.payload, 100), 0)
        newState.resource = resource
        if(resource <= 0) newState.inVoidform = false
        break;
    }

    return newState
  }, defaultState)

  const drainRate = 1
  const drainStart = 10
  const stackHaste = .02
  const baseHaste = 1
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

  const handleIncrement = () => {
    setSpeed(speed+1)
  }

  const handleDecrement = () => {
    setSpeed(Math.max(speed-1, 0))
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
        {/* {state.inVoidform ? <Voidform drainRate={drainRate} drainStart={drainStart} haste={state.haste} stackHaste={stackHaste} baseHaste={baseHaste} maxStacks={maximumVoidformStacks} triggerEvent={updateState}/> : null}
        <ResourceBar current={state.resource} max={100}/>
        <button onClick={enterVoidform}>Enter Voidform!</button>
        <button onClick={gainInsanity}>+10 Insanity</button>
        <div>{state.inVoidform ? "Voidform Stacks: " + state.stacks : ""}</div>
        <AbilityBar haste={state.haste} triggerEvent={updateState}/>
         <StaticProgressAbility /> */}
         <Timer speed={speed} duration={10}/>
         <Increment speed={speed} increaseSpeed={handleIncrement} decreaseSpeed={handleDecrement} />
      </header>
    </div>
  );
}

export default App;
