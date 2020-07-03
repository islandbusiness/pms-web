import React from 'react';




export const Debug = ({ data, display }) => {
    if (process.env.NODE_ENV !== 'development') return null;

    return <pre style={{ display: display ? 'block' : 'none' }}>
        {JSON.stringify(data, 0, 4)}
    </pre>
}