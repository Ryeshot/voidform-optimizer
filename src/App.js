import React, {useState} from 'react';
import './App.css';
import AbilityBar from "./components/AbilityBar"

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello</p>
        {/* <input type="image" src="images/void-bolt.jpg" /> */}
        {/* {Object.keys(abilities).map(k => {
          //let ability = abilities[k]
          return <ProgressAbility radius={100} stroke={100} progress={progress} icon={k} />
        }) */}
        <AbilityBar haste={1}/>
         {/* <StaticProgressAbility /> */}
      </header>
    </div>
  );
}

export default App;
