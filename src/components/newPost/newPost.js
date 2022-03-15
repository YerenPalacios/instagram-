import icon from './new-post.png'
import './newPost.scss'
import { useState, useEffect, useRef } from 'react';
import { getToken, getUserSesion } from '../../helpers';
import api from './../../api.json'
import {default as ico} from './../icons'


export default function NewPost({hide}){
    const [addingMedia, setAddingMedia] = useState(true)
    const [actualMedia, setActualMedia] = useState(null)
    const [publishing, setPublishing] = useState(false)
    const [data, setData] = useState({
        images:[],
        text:""
    })
    const user = getUserSesion().user

    const handleAddFile = ({target}) => {
        // TODO: remember how to send images :u
        console.log(target.files)
        const files = Array.from(target.files)
        // let images = files.forEach(file => {
        //     return 'nada'
        // })
        setAddingMedia(false)
        setData({...data, images:files})
        setActualMedia(URL.createObjectURL(target.files[0]))
        setPublishing(true)
    }

    const handleChange = ({target})=>{
        setData({...data,text:target.value})
    }
    
    const handleSubmit = (e)=>{
        //something weird...
        e.preventDefault()
        createPost()
    }

    const createPost = () => {
        console.log(data)
        hide(!true)
        fetch(api.url+'post/',{
            method: 'POST',
            headers: {
                'Authorization': getToken(), 
                'Content-type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(res => res.json())
        .then(data => console.log(data))
    }

    return(
        <div className="new-post-div">
            <div onClick={()=>hide(!true)} className="close-item"></div>
            {addingMedia?
                <div className="new-post">
                    <h1>Crea una nueva publicación</h1>  
                    <div>
                        <img src={icon} alt="add photo" />
                        <p>Arrastra las fotos y los videos aquí</p>
                        <input onChange={handleAddFile} type="file" id="images"/>
                        <label htmlFor='images'>seleccionar de la computadora</label>
                    </div>
                </div>
            :
                <div className="new-post">
                    <h1>Crea una nueva publicación <label htmlFor="send">Compartir</label></h1>
                    <form onSubmit={handleSubmit} className='form'>
                        <div className="actualmedia">
                            <img src={actualMedia} alt="" />
                        </div>
                        <div>
                            <div className="user">
                                <img src={api.url+user.image} alt="" />
                                <p>User name</p>
                            </div>
                            <textarea
                                onChange={handleChange} 
                                placeholder="Escribe una descripcion" 
                                name="desc" id="" cols="30" rows="10"></textarea>
                            <input style={{display:'none'}} type="submit" id="send" value="Send" />
                            <button style={{opacity:.5}} type="button">{ico.face}</button>
                        </div>
                    </form>
                </div>
            }   
            
        </div>
    )
}