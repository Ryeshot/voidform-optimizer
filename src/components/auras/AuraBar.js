import React, {useState, useEffect, useReducer, useRef} from 'react';
import LingeringInsanity from "./LingeringInsanity"
import Voidform from "./Voidform"
import DamageOverTime from './DamageOverTime';
import Buff from "./Buff"
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

const buffs = [
  {
    name: "power-infusion",
    icon: "images/power-infusion.jpg",
    displayName: "Power Infusion"
  },
  {
    name: "fae-blessings",
    icon: "images/fae-blessings.jpg",
    displayName: "Fae Blessings"
  },
  {
    name: "bloodlust",
    icon: "images/bloodlust.jpg",
    displayName: "Bloodlust"
  },
  {
    name: "dark-thoughts",
    icon: "images/dark-thoughts.jpg",
    displayName: "Dark Thoughts"
  }
]

const AuraBar = (props) => {
    const {auras, triggerEvent, settings, effectHandler, haste} = props
    const {lingeringInsanity, voidform} = settings 

    return (
        <div className="aura-container">
          {auras.voidform.active 
          ? <Voidform 
            {...voidform}
            {...auras.voidform}
            triggerEvent={triggerEvent}
            effectHandler={effectHandler} /> 
          : null}
          {auras.lingeringInsanity.active
          ? <LingeringInsanity 
            {...lingeringInsanity}
            {...auras.lingeringInsanity} 
            inVoidform={auras.voidform.active} 
            triggerEvent={triggerEvent}
            effectHandler={effectHandler} />
          : null}
          {dots.map(dot => 
            auras[dot.name].active
            ? <DamageOverTime
                key={`dot-${dot.name}`}
                {...dot}
                {...auras[dot.name]}
                {...settings[dot.name]}
                haste={haste}
                triggerEvent={triggerEvent}
                effectHandler={effectHandler} />
            : null
          )}
          {buffs.map(buff => 
            auras[buff.name].active
            ? <Buff
                key={`buff-${buff.name}`}
                {...buff}
                {...auras[buff.name]}
                setting={settings[buff.name]}
                triggerEvent={triggerEvent}
                effectHandler={effectHandler} />
            : null
          )}
        </div>       
    )
}

export default AuraBar


