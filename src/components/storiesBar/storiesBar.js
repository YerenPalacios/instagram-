import './storiesBar.css'
import {useState, useEffect} from 'react'
import api from '../../api.json'
import { Link } from 'react-router-dom'

export default function StoriesBar(){
    const [profiles, setProfiles] = useState([]) 

    useEffect(() => {
        fetch(api.url+'profile-stories/')
        .then(res => res.json())
        .then(data => setProfiles(data))
    }, [])

    if (profiles.length) {
        return(
            <div className="stories_bar">
                {profiles.map((p,i)=>(
                    <div className="profile">
                        <img src={p.image} alt="" />
                        <p><Link to={"/"+p.name}>{p.name}</Link></p>
                    </div>
                ))}
                
            </div>
        )  
    } else return null
    
}