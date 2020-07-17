import {useEffect, useRef} from "react"

export const useCleanup = (target, value, cleanup) => {
    const ref = useRef()

    useEffect(() => {
        if(ref.current === target) {
            cleanup()
        }       
        ref.current = value
    }, [value])
}

export const useHashRemover = () => {
    useEffect(() => {
        console.log("Here")
        console.log(window.location.pathname)
        window.history.replaceState(null, document.title, window.location.pathname + window.location.search)
    }, [])
}