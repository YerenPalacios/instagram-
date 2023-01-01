import { useContext } from 'react';
import { AuthContext } from '../../../context/datacontext';
import './HomeSide.scss'
import api from '../../../api.json'
import { useEffect } from 'react';
import { useState } from 'react';
import { getUserImage, useFetch } from '../../../helpers';

function User({ data }) {
    const { post, remove, loading } = useFetch()
    const [following, setFollowing] = useState(data.following)

    const handleFollow = (e) => {
        //TODO: validate that user cannot click if nothing loaded
        if (loading) return
        let body = { "following": data.id }
        if (!following)
            post('follow/', body).then(() => {
                setFollowing(true)
            })
        else
            remove('follow/', body).then(() => {
                setFollowing(false)
            })
    }

    return <div className="profile" >
        <div className="image small"><img src={data.image ? data.image : getUserImage(data)} alt="icon" /></div>
        <div className='info'>
            <h3>{data.username}</h3>
            <p>{data.name}</p>
        </div>
        <button onClick={handleFollow} className={loading ? "simpleButton loadingBtn" : "simpleButton"}>{following ? 'Unfollow' : 'Follow'}</button>
    </div>
}

export default function HomeSide() {
    const { auth } = useContext(AuthContext);

    const [users, setUsers] = useState([])
    const { get } = useFetch()

    useEffect(() => {
        get('user/').then(data => {
            setUsers(data.map(i => <User key={i.id} data={i} />))
        })
    }, [])

    return <div className="homeSide">
        <div className="profile">
            <div className="image"><img src={api.url + getUserImage(auth.user)} alt="icon" /></div>
            <div className='info'>
                <h3>{auth.user.username}</h3>
                <p>{auth.user.name}</p>
            </div>
            <button className="simpleButton">Switch</button>
        </div>
        <div className="suggestion"><p>Sugerencias para ti</p><button className="simpleButton">Ver todos</button></div>
        {users}
    </div>
}