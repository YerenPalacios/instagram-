import {useState, useEffect} from 'react'
import Post from '../components/Post/post'
import api from '../api.json'
import Header from '../components/haeader/header'
import {useNavigate} from 'react-router-dom'
import StoriesBar from '../components/storiesBar/storiesBar'
import './pages.css'
import {api_, getToken} from '../helpers'
import Error from '../components/errors/error'


async function getData(path){
    const res = await fetch(api.url+path,{
        headers:{'Authorization':getToken()},
    })
    // if (!res.ok){
    //     return false
    // }
    const data = await res.json()
    return data
    
}

export default function Home(){
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [error, setError] = useState(false)
    const url = api.url+'post/'
    
    const options = {
        method: 'GET',
        headers:{
            'Authorization':getToken()
        },
    }
    
    useEffect(()=>{
        fetch(url, options)
        .then(res=>{
            if (!res.ok) setError(res)
            return res.json()
        })
        .then(data => {
            setPosts(data) 
            setError(false)
        })
    },[])
    
    var posts_list = posts.length? posts.map((post, i) => (
        <Post key={i} data={post}/>
        )) : null

    return(
        <div>
            {error?<Error error={error}/>:null}
            <Header/>
            
            <div className="container">
                <StoriesBar/>
                {posts_list} 
            </div>
            
        </div>
       
    )
}