import { useState, useEffect } from 'react'
import Post from '../components/Post/post'
import StoriesBar from '../components/home/storiesBar/storiesBar'
import './pages.scss'
import { useFetch } from '../helpers'
import Page from '../components/page/page'
import HomeSide from '../components/home/homeSide/HomeSide'

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

    return <Page>
        <div className="flexContainer">
            <div>
                <StoriesBar />
                {loading && <p>cargando...</p>}
                {posts}
            </div>
            <HomeSide/>
        </div>
    </Page>
}