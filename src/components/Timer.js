import React, {useState, useEffect, useReducer, useRef} from 'react';

const Timer = (props) => {

    const {duration, speed} = props

    const [time, setTime] = useState(0)
    //const [speed, setSpeed] = useState(props.speed)

    const interval = 100

    useEffect(() => {
        console.log("Inside component render")

    }, [speed])

    const speedRef = useRef(speed)
    speedRef.current = speed

    const start = () => {

        const startTime = Date.now()

        console.log("Started")

        const timer = setInterval(() => {

            console.log(timer)

            if(Date.now() >= startTime + (duration*1000)) {
                console.log("Stopping timer")
                clearInterval(timer)
            }

            setTime(time => time + speedRef.current)
        }, interval)
    }

    return (
        <div>
            <button onClick={start}>Click Me!</button>
            <div>{time}</div>
        </div>
    )
}

export default Timer