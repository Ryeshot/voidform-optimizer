import React from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import VoidformOptimizer from "./VoidformOptimizer"
import DesignPhilosophy from "./DesignPhilosophy"

export default () => {
    return (
        <Router>
          <div>
            <Switch>
                <Route path="/articles/design-philosophy">
                  <DesignPhilosophy />
                </Route>
                <Route path="/">
                    <VoidformOptimizer />
                </Route>
            </Switch>
          </div>
        </Router>
      )
}