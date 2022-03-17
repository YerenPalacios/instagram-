import { useState, useEffect } from 'react'
import './error.scss'

export default function Error({error}){
    const [show, setShow] = useState(true)
    const [styles,setStyles] = useState({transform: 'rotateX(90deg)'})

    useEffect(() => {
        setStyles({
            transform: 'rotateX(0deg)'
        })
        setTimeout(() => {
            setStyles({
                transform: 'rotateX(90deg)'
            })
        },4000)
        setTimeout(() => {
            setShow(false)
        },5000)
    },[])

    if (show){
        return(
            <div style={styles} className="error">
                <h1>Error {error.status}</h1>
                <p>{error.statusText}</p>
            </div>            
        )
    }
    return null
    
}