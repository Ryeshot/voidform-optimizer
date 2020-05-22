import React, {useState, useEffect, useReducer} from 'react';

const Increment = (props) => {

    const {speed, increaseSpeed, decreaseSpeed} = props

    return (
        <div>
            <button onClick={increaseSpeed}>+</button>
            <button onClick={decreaseSpeed}>-</button>
            <div>{speed-1}x</div>
        </div>
    )
}

export default Increment