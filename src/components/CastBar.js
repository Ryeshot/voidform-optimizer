import React, {useState, useEffect, useReducer, useRef} from 'react';

const CastBar = (props) => {

    const {time, name, duration, direction} = props

    const sec = 1000
    const interval = 50

    const [current, setCurrent] = useState(0)

    const timeRef = useRef(time)
    const durationRef = useRef(time)

    timeRef.current = time
    durationRef.current = duration

    useEffect(() => {
        const timer = setInterval(() => {
            let now = Date.now()
            setCurrent(current => now - timeRef.current)
        }, interval)

        return () => {
            clearInterval(timer)
            setCurrent(current => 0)
        }
    }, [name])

    return (
        <div id="cast-bar">
            <div className="left-progress-text">{name}</div>
            <div className="right-progress-text">{direction 
            ? `${(current/sec).toFixed(1)}/${((duration/sec).toFixed(1))}`
            : `${((durationRef.current-current)/sec).toFixed(1)}/${((durationRef.current/sec).toFixed(1))}`}sec</div> 
            <div className="progress-bar" 
                style={{
                    width: direction 
                    ? `${(current/durationRef.current*100).toFixed(2)}%`
                    : `${((durationRef.current-current)/durationRef.current*100).toFixed(2)}%`
            }}>
            </div>
        </div>
    )
}

export default CastBar