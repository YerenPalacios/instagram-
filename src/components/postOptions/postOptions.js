import './postOptions.scss';
import api from './../../api.json'
import { getToken } from '../../helpers';
import { useState } from 'react';
import Error from '../errors/error';
import { useNavigate } from 'react-router-dom';


export default function PostOptions({id,hide}){
    const navigate = useNavigate()
    const [error, setError] = useState(false)
    const url = `${api.url}post/${id}`
    const options = {
        method: 'DELETE',
        headers:{
            'Authorization':getToken()
        },
    }

    const handleDelete = () => {
        fetch(url, options)
        .then(res=>{
            if (!res.ok) setError(res)
            hide(!true)
            window.location.reload(false)
            return res.json()
        })
        .then(data => {
            console.log(data) 
            setError(false)
        })
    }

    const goPost = () => {
        navigate('post/'+id)
    }

    return(
        <div className="post-options">
            {error?<Error error={error}/>:null}
            <div onClick={()=>hide(!true)} className="close-item"></div>
            <div className="options">
                <button onClick={handleDelete}>Eliminar</button>
                <button onClick={goPost}>Ir a la publicación</button>
            </div>
        </div>
    )
}
