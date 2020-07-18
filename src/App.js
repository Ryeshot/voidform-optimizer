import React, {useState} from "react"
import {
    HashRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
import VoidformOptimizer from "./VoidformOptimizer"
import DesignPhilosophy from "./components/articles/DesignPhilosophy"
import Ramp from "./components/articles/Ramp"

export default () => {

    return (
      <Router>
        <div>
          <Switch>
              <Route path="/articles/design-philosophy">
                <DesignPhilosophy />
              </Route>
              <Route path="/articles/ramp">
                <Ramp />
              </Route>
              <Route path="/">
                <VoidformOptimizer />
              </Route>
          </Switch>
        </div>
      </Router>    
  );
}
