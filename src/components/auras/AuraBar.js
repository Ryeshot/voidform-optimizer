import React, {useState, useEffect, useReducer, useRef} from 'react';
import LingeringInsanity from "./LingeringInsanity"
import Voidform from "./Voidform"

const AuraBar = (props) => {

    const {auras, triggerEvent, settings} = props
    const {lingeringInsanity, voidform} = settings  

    return (
        <div className="aura-container">
              {auras.voidform.active 
              ? <Voidform 
                {...voidform}
                paused={auras.voidform.paused}
                triggerEvent={triggerEvent}/> 
              : null}
             {auras.lingeringInsanity.active
            ? <LingeringInsanity 
              {...lingeringInsanity}
              {...auras.lingeringInsanity} 
              inVoidform={auras.voidform.active} 
              triggerEvent={triggerEvent}/>
            : null}
        </div>       
    )
}

export default AuraBar


