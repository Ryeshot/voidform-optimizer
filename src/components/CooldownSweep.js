import React, {useState, useEffect, useRef} from 'react';

import "./CooldownSweep.css"

const CooldownSweep = (props) => {

    const {size, radius, image, desaturated, stroke, progress, inverse} = props

    const normalizedRadius = radius - (stroke/2)
    const circumference = normalizedRadius * 2 * Math.PI

    return (
        <svg width={size} height={size}>
            <circle
                fill="transparent"
                strokeWidth={stroke}
                strokeOpacity={.7}
                strokeDasharray={circumference + " " + circumference}
                strokeDashoffset={inverse ? ((progress === 0 ? circumference : 0) + progress * circumference) : (circumference + progress * circumference)}
                stroke={"rgb(0,0,0)"}
                cx={size/2}
                cy={size/2}
                r={normalizedRadius} />
        </svg>
    )
}

export default CooldownSweep