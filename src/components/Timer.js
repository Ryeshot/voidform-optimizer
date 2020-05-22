import React, {useState, useEffect, useReducer} from 'react';

const Timer = (props) => {

    const {speed, duration} = props

    const [time, setTime] = useState(0)

    const interval = 100

    useEffect(() => {

    }, [speed])

    const start = () => {

        const startTime = Date.now()

        console.log("Started")

        const timer = setInterval(() => {

            console.log(speed)

            if(Date.now() >= startTime + (duration*1000)) {
                console.log("Stopping timer")
                clearInterval(timer)
            }

            setTime(time => time + speed)
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