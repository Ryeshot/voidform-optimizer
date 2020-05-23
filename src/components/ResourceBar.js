import React, {useState, useEffect, useReducer} from 'react';
import "./ResourceBar.css"

const ResourceBar = (props) => {
    const {max, current, voidform} = props

    return (
        <div className="container">
            <div className="progress-text">{(current/max*100).toFixed(0)}</div> 
            <div className="progress-bar" 
                style={{
                    width: `${(current/max*100).toFixed(2)}%`
            }}>
            </div>
        </div>
        
        // <div>
        //     Resource Bar
        //     <div height="24px" width="50%"></div>
        // </div> 
    )
}

export default ResourceBar