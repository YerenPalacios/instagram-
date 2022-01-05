import {useState, useEffect} from 'react'
import Post from '../components/Post/post'
import api from '../api.json'
import Header from '../components/haeader/header'
import StoriesBar from '../components/storiesBar/storiesBar'
import './pages.css'


async function getData(path){
    const res = await fetch(api.url+path+'/')
    const data = await res.json()
    return data

}

export default function Home(){
    const [posts, setPosts] = useState([])

    useEffect(()=>{
        getData('post').then(data => {
            console.log(data)
            setPosts(data)
            
        })
    },[])

    var posts_list = posts.map((post, i) => (
        <Post key={i} data={post}/>
    ))

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