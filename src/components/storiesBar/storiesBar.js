import './storiesBar.css'
import {useState, useEffect, useRef} from 'react'
import api from '../../api.json'
import { Link } from 'react-router-dom'
import testImg from '../../p.png'
import {getToken} from '../../helpers'

export default function StoriesBar(){
    const [profiles, setProfiles] = useState([]) 

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        fetch(api.url+'profile-stories/',{
            signal:signal,
            headers:{'Authorization':getToken()}
        })
        .then(res => res.json())
        .then(data => setProfiles(data))
        .catch((err)=>console.log(err.name))
        
        return () => controller.abort()
    }, [])


    if (profiles.length != 0) {
        return(
            <div className="stories_bar">
                {profiles.map((p,i)=>(
                    <div key={i} className="profile">
                        <img src={p.image? p.image : testImg} alt="" />
                        <p><Link to={"/"+p.name}>{p.name}</Link></p>
                    </div>
                ))}
                
            </div>
        )  
    } else return null
    
}