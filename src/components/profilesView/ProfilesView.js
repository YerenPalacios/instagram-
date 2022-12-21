import { useEffect, useState, useContext } from "react"
import { useNavigate, useParams, Link } from 'react-router-dom'

import './profilesView.scss'
import testImg from '../../p.png'
import { useFetch } from '../../helpers'
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
    const navigate = useNavigate()
    const { username } = useParams()
    const { auth } = useContext(AuthContext)
    const { get, post, remove, loading } = useFetch('chatlist/')

    const [user, setUser] = useState({})
    const [following, setFollowing] = useState()
    const [isSesionUser, setIsSesionUser] = useState(false)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        get('user/' + username).then(data => {
            // TODO: review how to set not found True 
            if (data.detail) {
                setNotFound(true)
            } else {
                setUser(data)
                setFollowing(data.following)
                setIsSesionUser(auth.user.id === data.id)
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
        post('chatlist/', { username }).then(() => navigate('/inbox/' + username))
    }

    const handleFollow = () => {
        //TODO: validate that user cannot click if nothing loaded
        let body = { "following": user.id }
        if (!following)
            post('follow/', body).then(() => {
                setFollowing(!following)
                setUser({ ...user, followers_count: user.followers_count + 1 })
            })
        else
            remove('follow/', body).then(() => {
                setFollowing(!following)
                setUser({ ...user, followers_count: user.followers_count - 1 })
            })
    }

    return (
        <div>
            <div className="profilesView">
                <div className="user-image"><img src={user.image || testImg} alt="" /></div>
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
                                <button disabled={loading} onClick={handleFollow}>
                                    {following ? 'unfollow' : 'follow'}
                                </button> 
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
                    <p className="desc">{user.description}</p>
                </div>
            </div>
            <ProfileBody />
        </div>
    )
}
