import { useState, useCallback, useRef } from "react"

export default () => {
    const [observers, setObservers] = useState([])
    const observersRef = useRef(observers)
    observersRef.current = observers
    const subscribe = (observer) => {
        setObservers(o => [...o, observer])
    }
    const unsubscribe = (source) => {
        setObservers(obs => obs.filter(o => o.source !== source))
    }
    return [observersRef.current, subscribe, unsubscribe]
}