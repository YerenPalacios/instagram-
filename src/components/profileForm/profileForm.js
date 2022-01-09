import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from '../../api.json'
import {getToken} from '../../helpers'
import './profileForm.css'


export function ProfileForm(){
    const {username} = useParams()
    const [user, setUser] = useState({})

    const [updateData, setUpdateData] = useState({
        username:'',
        password:''
    })

    useEffect(() => {
        fetch(api.url+"user/"+username,{
            headers: {'Authorization':getToken()}
        })
        .then(res => res.json())
        .then(data => {
            setUser(data)
            setUpdateData({
                username:data.username,
                email:data.email
            })
        })
    }, [])

    const handleUpdateData = ({target}) => {
        setUpdateData({
            ...updateData,
            [target.name]:target.value
        })
    }

    const handleSubmitData = ()=>{
        console.log(updateData)
    }

    return(
        <div className="profile-form">
            <div className="profile">
                <img src={user.image} alt="" />
                <div>
                    <p>{user.username}</p>
                    <p className="change-image">Cambiar foto del perfil</p>
                </div>
            </div>
            <div className="input">
                <p className="label">Nombre</p>
                <input disabled type="text" value={user.name}/>
            </div>
            <div className="input">
                <p className="label">Nombre de usuario</p>
                <input name="username" onChange={handleUpdateData} type="text" value={updateData.username} />
            </div>
            <div className="input">
                <p className="label">Correo electrónico</p>
                <input name="email" onChange={handleUpdateData} type="text" value={updateData.email} />
            </div>
            <button onClick={handleSubmitData} className="submit">Enviar</button>
        </div>
    )
}

export function PasswordForm(){
    const {username} = useParams()
    const [user, setUser] = useState({})

    const [passwordData, setPasswordData] = useState({
        lastPassword:'',
        newPassword:'',
        confirmPassword:''
    })

    useEffect(() => {
        fetch(api.url+"user/"+username,{
            headers: {'Authorization':getToken()}
        })
        .then(res => res.json())
        .then(data => setUser(data))
    }, [])

    const handlePasswordData = ({target}) => {
        setPasswordData({
            ...passwordData,
            [target.name]:target.value
        })
    }

    const handleSubmitPasswordData = () => {
        console.log(passwordData)
    }

    return(
        <div className="profile-form">
            <div className="profile">
                <img src={user.image} alt="" />
                <div>
                    <p>{user.username}</p>
                </div>
            </div>
            <div className="input">
                <p className="label">Contraseña anterior</p>
                <input onChange={handlePasswordData} type="password" name="lastPassword" value={passwordData.lastPassword}/>
            </div>
            <div className="input">
                <p className="label">Contraseña nueva</p>
                <input onChange={handlePasswordData} type="password" name="newPassword" value={passwordData.newPassword}/>
            </div>
            <div className="input">
                <p className="label">Confirmar contraseña nueva</p>
                <input onChange={handlePasswordData} type="password" name="confirmPassword" value={passwordData.confirmPassword}/>
            </div>
            <button onClick={handleSubmitPasswordData} className="submit">Cambiar contraseña</button>
        </div>
    )
}