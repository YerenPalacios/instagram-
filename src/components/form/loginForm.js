import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './loginForm.css'
import api from '../../api.json'

function saveData(data){
    localStorage.setItem('auth', JSON.stringify(data))
}

function RegForm({change}){
    return(
        <>
        <br />
        <div className="block">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2560px-Instagram_logo.svg.png" alt="" className="logo" />
            <p className="desc">Regístrate para ver fotos y videos de tus amigos.</p>
            <div className="inputs">
                <input type="text" placeholder="Número de celular o correo electrónico"/>
                <input type="text" placeholder="Correo electronico"/>
                <input type="text" placeholder="Nombre de usuairio"/>
                <input type="text" placeholder="Contraseña"/>
                <button>Registrarse</button>
            </div>
        </div>
        <div className="block">
            ¿Tienes una cuenta? <a href="#" onClick={change}>Inicia sesión</a>
        </div>
        </>
    )
}

export default function LoginForm(){
    let navigate = useNavigate()
    
    const [form, setForm] = useState('login')
    const [loginData, setLoginData] = useState({
        email:'',
        password:''
    })
    const [error, setError] = useState(false)

    const toggleForm = ()=>{
        var actual = form === 'login'? 'reg': 'login'
        setForm(actual)
    }

    const handleLoginData = ({target})=>{
        setLoginData({
            ...loginData,
            [target.name]:target.value
        })
    }

    // TODO: django validation fields


    const handleLogin = ()=>{
        if(loginData.email.length > 0 && loginData.password.length > 0){

            fetch(api.url+'login/',{
                headers: {'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify(loginData)
            }).then(res => {
                if (!res.ok) throw new Error('Error al buscar usuario')
                return res.json()
            })
            .then(data => {
                saveData(data)
                navigate('/')
                console.log('ya')
            })
            .catch(err => {
                setError(err.message)
            })
            
        }
    }



    if(form === 'login'){
        return(
            <>
            <br />
            <div className="block">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2560px-Instagram_logo.svg.png" alt="" className="logo" />
                <div className="inputs">
                    <input type="text" name="email" onChange={handleLoginData} value={loginData.email} placeholder="Teléfono, usuario o correo electrónico"/>
                    <input type="text" name="password" onChange={handleLoginData} value={loginData.password} placeholder="Contraseña"/>
                    <button onClick={handleLogin}>Iniciar sesión</button>
                    {error? <p className="error">{error}</p> : null}
                    <a className="link2" href="#">¿Olvidaste tu contraseña?</a>
                </div>
            </div>
            <div className="block">
                ¿No tienes una cuenta? <a onClick={toggleForm} href="#">Registrate</a>
            </div>
            </>
        )
    } else return(<RegForm change={toggleForm}/>)
}