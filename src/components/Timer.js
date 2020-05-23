import React, {useState, useEffect, useReducer, useRef} from 'react';

const Timer = (props) => {

    const {speed} = props

    const [time, setTime] = useState(0)
    //const [speed, setSpeed] = useState(props.speed)

    const interval = 100

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(time => time + 1)
        }, interval)

        return () => clearInterval(timer)

    }, [speed])

    return (
        <div>
            Timer
            <div>{time}</div>
        </div>
    )
}

export default Timer