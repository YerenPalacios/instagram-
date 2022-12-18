import { useEffect, useState } from "react"
import { useNavigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { getUserSesion, useFetchv2 } from '../../helpers'
import testImg from '../../p.png'

import api from '../../api.json'
import './profilesView.scss'
import { useContext } from "react"
import { AuthContext } from "../../context/datacontext"

function ProfileBody() {
    return (
        <div className="profile-body">
            <ul className="tablist">
                <li>Publicaciones</li>
                <li>Guardado</li>
                <li>Etiquetadas</li>
            </ul>

        </div>
    )
}

export default function ProfilesView() {
    const { auth } = useContext(AuthContext)
    const { username } = useParams()
    const [isSesionUser, setIsSesionUser] = useState(false)
    const [user, setUser] = useState({})
    const [notFound, setNotFound] = useState(false)
    const { post, remove, loading } = useFetchv2('chatlist/')
    const navigate = useNavigate()
    const [following, setFollowing] = useState()

    useEffect(() => {
        fetch(api.url + 'user/' + username, {
            headers: { 'Authorization': 'Token ' + auth.token }
        })
            .then(res => res.json())
            .then(data => {
                if (data.detail) {
                    setNotFound(true)
                } else {
                    setUser(data)
                    setFollowing(data.following)
                    setIsSesionUser(getUserSesion().user.id === data.id)
                }
            })
    }, [username])

    if (notFound) {
        return (
            <div className="not-found">
                <h1>Esta página no está disponible.</h1>
                <p>Es posible que el enlace que seleccionaste esté roto o que se haya eliminado la página.</p>
                <Link to="/">Volver a Instagram.</Link>
            </div>
        )
    }

    const createMessaje = () => {
        post('chatlist/', { "username": username }).then(() => {
            navigate('/inbox/' + username)
        })

    }

    const handleFollow = () => {
        //TODO: validate that user cannot click if nothing loaded
        if (!following)
            post('follow/', { "following": user.id }).then(() => {
                setFollowing(!following)
                setUser({ ...user, followers_count: user.followers_count + 1 })
            })
        else
            remove('follow/', { "following": user.id }).then(() => {
                setFollowing(!following)
                setUser({ ...user, followers_count: user.followers_count - 1 })
            })
    }


    return (
        <div>
            <div className="profilesView">
                <div className="user-image">
                    <img src={user.image || testImg} alt="" />
                </div>
                <div className="profile-data">
                    <div className="profile-name">
                        <h1>{user.username}</h1>
                        {isSesionUser ?
                            <>
                                <Link to="/edit">Editar Perfil</Link>
                                <div>o</div>
                            </> :
                            <>
                                <button onClick={createMessaje}>Enviar mensaje</button>
                                {following ?
                                    <button disabled={loading} onClick={handleFollow}>unfollow</button> :
                                    <button disabled={loading} onClick={handleFollow}>follow</button>
                                }
                                <button>A</button>
                                <div>...</div>
                            </>
                        }
                    </div>
                    <p className="profile-nums">
                        <span><b>{user.posts_count}</b> publicaciones</span>
                        <span><b>{user.followers_count}</b> seguidores</span>
                        <span><b>{user.following_count}</b> seguidos</span>
                    </p>
                    <p className="name"><b>{user.name}</b></p>
                    <p className="desc">
                        {user.description}
                    </p>
                </div>
            </div>
            <ProfileBody />
        </div>
    )
}
