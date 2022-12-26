import { useState, useEffect } from 'react'
import Post from '../components/Post/post'
import StoriesBar from '../components/storiesBar/storiesBar'
import './pages.css'
import { useFetch } from '../helpers'
import Page from '../components/page/page'

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
        <Page>
            <StoriesBar />
            {loading && <p>cargando...</p>}
            {posts}
        </Page>
    )
}