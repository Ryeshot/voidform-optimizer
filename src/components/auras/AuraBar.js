import React, {useState, useEffect, useReducer, useRef} from 'react';
import LingeringInsanity from "./LingeringInsanity"
import Voidform from "./Voidform"
import DamageOverTime from './DamageOverTime';
import { auraOptions } from '../../lib/options';

const AuraBar = (props) => {

    const {auras, triggerEvent, settings, haste} = props
    const {lingeringInsanity, voidform} = settings 
    
    //TODO: Move to lib
    const swpIcon = "images/shadow-word-pain.jpg"
    const vtIcon = "images/vampiric-touch.jpg"

    const swpName = "shadow-word-pain"
    const vtName = "vampiric-touch"

    const swpDisplayName = "Shadow Word: Pain"
    const vtDisplayName = "Vampiric Touch"

    const [state, triggerAuraEvent] = useReducer((state, action) => {

    })

    return (
        <div className="aura-container">
          {auras.voidform.active 
          ? <Voidform 
            {...voidform}
            {...auras.voidform}
            triggerEvent={triggerEvent}/> 
          : null}
          {auras.lingeringInsanity.active
          ? <LingeringInsanity 
            {...lingeringInsanity}
            {...auras.lingeringInsanity} 
            inVoidform={auras.voidform.active} 
            triggerEvent={triggerEvent}/>
          : null}
          {auras[swpName].active
          ? <DamageOverTime 
            icon={swpIcon}
            name={swpName}
            displayName={swpDisplayName}
            {...auras[swpName]}
            {...settings[swpName]}
            haste={haste}
            triggerEvent={triggerEvent}/>
          : null}
          {auras[vtName].active
          ? <DamageOverTime
            icon={vtIcon}
            name={vtName}
            displayName={vtDisplayName}
            {...auras[vtName]}
            {...settings[vtName]}
            haste={haste}
            triggerEvent={triggerEvent}/>
          : null}
        </div>       
    )
}

export default AuraBar


