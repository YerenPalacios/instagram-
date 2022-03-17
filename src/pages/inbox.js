import {useState, useEffect} from 'react'
import Header from '../components/haeader/header'
import './pages.css'
import useFetch from 'use-http'
import Error from '../components/errors/error'


export default function Inbox(){
    const [error, setError] = useState(false)

    return(
        <div>
            {error?<Error error={error}/>:null}
            <Header/>
            
            
        </div>
       
    )
}