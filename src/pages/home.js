import {useState, useEffect} from 'react'
import Post from '../components/Post/post'
import api from '../api.json'
import Header from '../components/haeader/header'
import {useNavigate} from 'react-router-dom'
import StoriesBar from '../components/storiesBar/storiesBar'
import './pages.css'
import {getToken} from '../helpers'


async function getData(path){
    const res = await fetch(api.url+path+'/',{
        headers:{'Authorization':getToken()},
    })
    if (!res.ok){
        return false
    }
    const data = await res.json()
    return data
    
}

export default function Home(){
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    
    useEffect(()=>{
        getData('post').then(data => {
            data == false? navigate('/login'): setPosts(data)
            
        })
    },[])
    
    var posts_list = posts.length? posts.map((post, i) => (
        <Post key={i} data={post}/>
        )) : null

    return(
        <div>
            <Header/>
            
            <div className="container">
                <StoriesBar/>
                {posts_list} 
            </div>
            
        </div>
       
    )
}