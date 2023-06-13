import React, { useEffect, useContext, useState, useRef } from 'react'
import Post from '../components/Post/post'
import StoriesBar from '../components/home/storiesBar/storiesBar'
import './pages.scss'
import { useFetch } from '../helpers'
import Page from '../components/page/page'
import HomeSide from '../components/home/homeSide/HomeSide'
import { PostContext } from '../context/datacontext'

export default function Home() {
    const { get, loading } = useFetch()
    const { posts, setPosts } = useContext(PostContext)
    const [limit, setLimit] = useState(2)
    const [offset, setOffset] = useState(0)
    const container_ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScrollEnd = () => {
            if (container_ref.current?.scrollHeight && container_ref.current?.scrollTop) {
                if (container_ref.current.scrollHeight <= container_ref.current.scrollTop + 500 && !loading) {
                    setOffset(offset + limit);
                    console.log('end');
                }
            }
        };

        container_ref.current?.addEventListener('scroll', handleScrollEnd);

        return () => {
            container_ref.current?.removeEventListener('scroll', handleScrollEnd);
        };
    }, [offset]);

    useEffect(() => {
        get(`post/?priority=true&limit=${limit}&offset=${offset}`).then((data: Post[]) => {
            setPosts([...posts, ...data]);
        });

        return () => {
            setPosts([]);
        };
    }, [offset]);
    return <Page container_ref={container_ref}>
        <div className="flexContainer">
            <div className="side_container">
                <StoriesBar />
                {posts?.map((post) => <Post key={post.id} data={post} />)}
                {loading && <p>cargando...</p>}
            </div>
            <HomeSide />
        </div>
    </Page>

}