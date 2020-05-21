import React from 'react';

const StaticProgressAbility = () => {

    let stroke = 100
    let radius = stroke
    let normalizedRadius = radius - (stroke/2)
    let circumference = normalizedRadius * 2 * Math.PI

    return (
        // <svg width="100" height="100">
        //     <rect width="100" height="100" style={{
        //         fill: "rgb(0,0,255)",
        //         strokeWidth: 100,
        //         stroke: "rgb(0,0,0)",
        //         strokeOpacity: .7,
        //         strokeDashoffset: 400 - 50/100 * 400,
        //         strokeDasharray: "400 400"
        //     }} />
        // </svg> 
        <svg width={radius/2} height={radius/2}>
        <circle 
            fill={"rgb(0,0,255)"}
            strokeWidth={stroke}
            strokeOpacity={.7}
            strokeDasharray={circumference + " " + circumference}
            strokeDashoffset={50/100 * circumference}
            style={{
                stroke: "rgb(0,0,0)"
                // strokeOpacity: .7,
                // strokeDashoffset: 400 - 50/100 * 400,
                // strokeDasharray: "400 400"
            }} 
            cx={radius/4}
            cy={radius/4}
            r={normalizedRadius} />
    </svg> 
    )
}


export default StaticProgressAbility;