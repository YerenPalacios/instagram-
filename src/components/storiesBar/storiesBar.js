import './storiesBar.css'
import {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import testImg from '../../p.png'

import {useFetch} from '../../helpers'
import Error from '../errors/error'

export default function StoriesBar(){
    const [profiles, setProfiles] = useState([]) 
    const res = useFetch('profile-stories/')
    const error = res.error

    useEffect(() => {
        if (res.data) setProfiles(res.data)
    }, [res])


    if(error) return(<Error error={error}/>)

    if (profiles.length != 0) {
        return(
            <div className="stories_bar">
                {res.isLoading? <p>loading...</p>: null}
                {profiles.map((p,i)=>(
                    <div key={i} className="profile">
                        <img src={p.image? p.image : testImg} alt="" />
                        <p><Link to={"/"+p.username}>{p.username}</Link></p>
                    </div>
                ))}
                
            </div>
        )  
    } else return null
    
}