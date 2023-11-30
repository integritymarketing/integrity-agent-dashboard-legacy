import React from 'react'

const Label = function ({ value, size, color, }) {
    const style = { fontSize: size || '24px', color: color || '#052A63' }

    return <div style={style}>{value}</div>
}

export default Label