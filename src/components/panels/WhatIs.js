import React from "react"
import "./WhatIs.css"

const WhatIs = (props) => {
    const {name, text, xPos, yPos} = props

    //console.log(xPos, yPos)
    const minimumHeight = 30

    const style = {
        left: `${xPos}px`,
        top: `${yPos+minimumHeight}px`
    }
    
    return (
        <div className="what-is" style={style}>
            <div className="what-is-header">What is... {name}?</div>
            <div className="what-is-description">{text}</div> 
        </div>
    )
}

export default WhatIs