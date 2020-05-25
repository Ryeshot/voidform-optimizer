import React, {useState, useEffect, useReducer, useRef} from 'react';
import LingeringInsanity from "./LingeringInsanity"
import Voidform from "./Voidform"

const AuraBar = (props) => {

    const {auras, triggerEvent, settings} = props
    const {lingeringInsanitySettings} = settings  

    const voidformSettings = {
        drainRate: 1,
        drainStart: 10,
        stackHaste: .02,
        baseHaste: 0,
        maxStacks: 10
    }

    return (
        <div className="aura-container">
             {auras.lingeringInsanity.active
            ? <LingeringInsanity 
              type={lingeringInsanitySettings.type} 
              settings={lingeringInsanitySettings} 
              startTime={auras.lingeringInsanity.startTime}
              haste={auras.lingeringInsanity.haste} 
              stacks={auras.lingeringInsanity.stacks} 
              inVoidform={auras.voidform.active} 
              triggerEvent={triggerEvent}/>
            : null}
            {auras.voidform.active 
            ? <Voidform 
              {...voidformSettings}
              triggerEvent={triggerEvent}/> 
            : null}
        </div>       
    )
}

export default AuraBar


