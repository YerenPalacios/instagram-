import icon from './new-post.png'
import './newPost.css'
import { useState, useEffect, useRef } from 'react';
import { getToken, getUserSesion } from '../../helpers';
import api from './../../api.json'


export default function NewPost({hide}){
    const [addingMedia, setAddingMedia] = useState(true)
    const [actualMedia, setActualMedia] = useState(null)
    const [publishing, setPublishing] = useState(false)
    const [data, setData] = useState({})
    const user = getUserSesion().user

    const handleAddFile = ({target}) => {
        // TODO: remember how to send images :u
        setAddingMedia(false)
        setData(data.images=target.files)
        setActualMedia(URL.createObjectURL(target.files[0]))
        setPublishing(true)
    }
    
    const handleSubmit = (e)=>{
        //something weird...
        e.preventDefault()
        setData(data.text=e.target['desc'].value)
        console.log(data)
        createPost()
    }

    const createPost = () => {
        hide(!true)
        fetch(api.url+'post/',{
            method: 'POST',
            headers: {'Authorization': getToken(), 'Content-type': 'application/json'},
            body: JSON.stringify(data),
        }).then(res => res.json())
        .then(data => console.log(data))
    }

    return(
        <div className="new-post-div">
            {addingMedia?
                <div className="new-post">
                    <h1>Crea una nueva publicación</h1>  
                    <div>
                        <img src={icon} alt="add photo" />
                        <p>Arrastra las fotos y los videos aquí</p>
                        <input onChange={handleAddFile} type="file" id="images"/>
                        <label for='images'>seleccionar de la computadora</label>
                    </div>
                </div>
            :
                <div className="new-post">
                    <h1>Crea una nueva publicación <button>⇝</button></h1>
                    <form onSubmit={handleSubmit} className='form'>
                        <div className="actualmedia">
                            <img src={actualMedia} alt="" />
                        </div>
                        <div>
                            <div className="user">
                                <img src={api.url+user.image} alt="" />
                                <p>User name</p>
                            </div>
                            <textarea placeholder="Escribe una descripcion" name="desc" id="" cols="30" rows="10"></textarea>
                            <input type="submit" value="Send" />
                        </div>
                    </form>
                </div>
            }   
            
        </div>
    )
}