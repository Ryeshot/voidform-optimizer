import React from "react"

export default Option = (type, value, onChange) => {
    return <input type="text" defaultValue={value} onChange={onChange} />
}