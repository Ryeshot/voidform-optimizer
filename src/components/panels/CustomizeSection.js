import React, {useState} from "react"
import SettingOption from "./SettingOption"
import WhatIs from "./WhatIs"
import "./Panel.css"

const CustomizeSection = (props) => {

    const {name, setting, options, onChange} = props

    const [showWhatIs, setShowWhatIs] = useState(false)
    const [whatIs, setWhatIs] = useState({})

    const handleChange = (optionKey, option) => {
        const newSetting = {...setting, [optionKey]: option}
        //console.log(newSetting)
        onChange(newSetting, name)
    }

    const handleShowWhatIs = (name, text, pos) => {
        setShowWhatIs(true)
        setWhatIs({
            name,
            text,
            xPos: pos.x,
            yPos: pos.y
        })    
    }

    const closeWhatIs = () => {
        setShowWhatIs(false)
        setWhatIs({})
    }

    return (
        <div className="customize-section">
            <div className="customoze-section-header">{setting.displayName}</div>
            {options.map(o => {
            return <SettingOption {...o} key={`${name}-${o.key}`} value={setting[o.key]} name={o.key} parentKey={`${name}-${o.key}`} onChange={handleChange} onHelp={handleShowWhatIs} closeHelp={closeWhatIs}/>
            })}
            {showWhatIs ? <WhatIs {...whatIs}/> : null}
        </div>
            
    )
}

export default CustomizeSection