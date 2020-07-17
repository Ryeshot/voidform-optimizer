import React, {useState} from "react"
import {
    HashRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
import VoidformOptimizer from "./VoidformOptimizer"
import DesignPhilosophy from "./components/articles/DesignPhilosophy"
import Ramp from "./components/articles/Ramp"
import {useHashRemover} from "./utils/hooks"

const RouteUtils = () => {
  useHashRemover()
  return null
}

export default () => {

    return (
      <Router>
        <div>
          <Switch>
              <Route path="/articles/design-philosophy">
                <RouteUtils />
                <DesignPhilosophy />
              </Route>
              <Route path="/articles/ramp">
                <RouteUtils />
                <Ramp />
              </Route>
              <Route path="/">
                <RouteUtils />
                <VoidformOptimizer />
              </Route>
          </Switch>
        </div>
      </Router>    
  );
}
