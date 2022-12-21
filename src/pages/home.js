import { useState, useEffect } from 'react'
import Post from '../components/Post/post'
import Header from '../components/haeader/header'
import StoriesBar from '../components/storiesBar/storiesBar'
import './pages.css'
import { useFetch } from '../helpers'

export default function Home() {
    const [posts, setPosts] = useState([])
    const { get, loading } = useFetch()

    useEffect(() => {
        get('post/').then(data =>
            setPosts(data.map((post, i) => (
                <Post key={i} data={post} />
            )))
        )
    }, [])

    return (
        <div>
            <Header />
            <div className="container">
                <StoriesBar />
                {loading && <p>cargando...</p>}
                {posts}
            </div>
        </div>
    )
}