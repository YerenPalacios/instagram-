import {useState, useEffect} from 'react'
import Post from '../components/Post/post'
import api from '../api.json'
import Header from '../components/haeader/header'
import {useNavigate} from 'react-router-dom'
import StoriesBar from '../components/storiesBar/storiesBar'
import './pages.css'
import {useFetch} from '../helpers'
import Error from '../components/errors/error'


export default function Home(){
    const [posts, setPosts] = useState([])

    const res = useFetch('post/')
    const error = res.error
    
    useEffect(()=>{
        if (res.data) setPosts(res.data)
    },[res])
    
    var posts_list = posts.length? posts.map((post, i) => (
        <Post key={i} data={post}/>
        )) : null

    return(
        <div>
            {error?<Error error={error}/>:null}            
            <Header/>
            <div className="container">
                <StoriesBar/>
                {res.isLoading?<p>cargando...</p>:null}
                {posts_list} 
            </div>
            
        </div>
       
    )
}