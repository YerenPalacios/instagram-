import { useEffect, useState } from "react"
import {useNavigate, useParams} from 'react-router-dom'
import {Link} from 'react-router-dom'
import {getUserSesion, useFetch} from '../../helpers'
import testImg from '../../p.png'

import api from '../../api.json'
import './profilesView.scss'

function ProfileBody(){
    const [actualTab, setActualTab] = useState(1)

    return(
        <div className="profile-body">
            <ul className="tablist">
                <li>Publicaciones</li>
                <li>Guardado</li>
                <li>Etiquetadas</li>
            </ul>

        </div>
    )
}

export default function ProfilesView(){
    const {username} = useParams()
    const [isSesionUser, setIsSesionUser] = useState(false)
    const [user, setUser] = useState({})
    const [notFound, setNotFound] = useState(false)
    const {post, error} = useFetch('chatlist/')
    const navigate = useNavigate()

    useEffect(()=>{
        fetch(api.url+'user/'+username)
        .then(res => res.json())
        .then(data => {
            if(data.detail){
                setNotFound(true)
            } else {
               setUser(data)
               setIsSesionUser(getUserSesion().user.id === data.id)
            }
            
        })
    },[])

    if (notFound){
        return(
            <div className="not-found">
                <h1>Esta página no está disponible.</h1>
                <p>Es posible que el enlace que seleccionaste esté roto o que se haya eliminado la página.</p>
                <Link to="/">Volver a Instagram.</Link>
            </div>
        )
    }

    const createMessaje = ()=>{
        post({"username": username})
        !error && navigate('/inbox/'+username)
    }

    return(
        <div>
            <div className="profilesView">
                <div className="user-image">
                    <img src={user.image || testImg} alt="" />
                </div>
                <div className="profile-data">
                    <div className="profile-name">
                        <h1>{user.username}</h1>
                        {isSesionUser?
                            <>
                                <Link to="/edit">Editar Perfil</Link>
                                <div>o</div>
                            </>:
                            <>
                                <button onClick={createMessaje}>Enviar mensaje</button>
                                <button>follow</button>
                                <button>A</button>
                                <div>...</div>
                            </>
                        }
                    </div>
                    <p className="profile-nums">
                        <span><b>{user.posts_count}</b> publicaciones</span>
                        <span><b>0</b> seguidores</span>
                        <span><b>0</b> seguidos</span>
                    </p>
                    <p className="name"><b>{user.name}</b></p>
                    <p className="desc">
                        {user.description}
                    </p>
                </div>
            </div>
            <ProfileBody/>
        </div>
    )
}
