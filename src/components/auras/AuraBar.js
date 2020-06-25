import React, {useState, useEffect, useReducer, useRef} from 'react';
import LingeringInsanity from "./LingeringInsanity"
import Voidform from "./Voidform"
import DamageOverTime from './DamageOverTime';
import { auraOptions } from '../../lib/options';

const dots = [
  {
    name: "shadow-word-pain",
    icon: "images/shadow-word-pain.jpg",
    displayName: "Shadow Word: Pain"
  },
  {
    name: "vampiric-touch",
    icon: "images/vampiric-touch.jpg",
    displayName: "Vampiric Touch"
  },
  {
    name: "devouring-plague",
    icon: "images/devouring-plague.jpg",
    displayName: "Devouring Plague"
  },
  {
    name: "shadowfiend",
    icon: "images/shadowfiend.jpg",
    displayName: "Shadowfiend"
  }
]

const AuraBar = (props) => {

    const {auras, triggerEvent, settings, haste} = props
    const {lingeringInsanity, voidform} = settings 

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
          {dots.map(dot => 
            auras[dot.name].active
            ? <DamageOverTime
                {...dot}
                {...auras[dot.name]}
                {...settings[dot.name]}
                haste={haste}
                triggerEvent={triggerEvent} 
              />
            : null
          )}
        </div>       
    )
}

export default AuraBar


