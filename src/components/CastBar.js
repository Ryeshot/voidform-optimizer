import React, {useState, useEffect, useReducer, useRef} from 'react';

const CastBar = (props) => {

    const {time, name, duration, direction} = props

    const sec = 1000
    const interval = 50

    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            let now = Date.now()
            setCurrent(current => now - time)
        }, interval)

        return () => clearInterval(timer)
    }, [name])

    return (
        <div className="container">
            <div className="left-progress-text">{name}</div>
            <div className="right-progress-text">{direction 
            ? `${(current/sec).toFixed(1)}/${((duration/sec).toFixed(1))}`
            : `${((duration-current)/sec).toFixed(1)}/${((duration/sec).toFixed(1))}`}sec</div> 
            <div className="progress-bar" 
                style={{
                    width: direction 
                    ? `${(current/duration*100).toFixed(2)}%`
                    : `${((duration-current)/duration*100).toFixed(2)}%`
            }}>
            </div>
        </div>
    )
}

export default CastBar