import {useEffect, useRef} from "react"

export const useCleanup = (target, value, cleanup) => {
    const ref = useRef()

    useEffect(() => {
        if(ref.current === target) {
            console.log("Inside use cleanup for: " + target)
            cleanup()
        }       
        ref.current = value
    }, [value])
}