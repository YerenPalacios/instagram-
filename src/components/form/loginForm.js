import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import './loginForm.scss'
import { AuthContext } from "../../context/datacontext";
import { useFetchv2 } from "../../helpers";
import { LocalStorage } from "../../services/LocalStorage.service";

function RegForm({ change }) {
    return (
        <>
            <br />
            <div className="block">
                {/* <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2560px-Instagram_logo.svg.png" alt="" className="logo" /> */}
                <p className="desc">Regístrate para ver fotos y videos de tus amigos.</p>
                <div className="inputs">
                    <input type="text" placeholder="Número de celular o correo electrónico" />
                    <input type="text" placeholder="Correo electronico" />
                    <input type="text" placeholder="Nombre de usuairio" />
                    <input type="text" placeholder="Contraseña" />
                    <button>Registrarse</button>
                </div>
            </div>
            <div className="block">
                ¿Tienes una cuenta? <a href="#" onClick={change}>Inicia sesión</a>
            </div>
        </>
    )
}

export default function LoginForm() {
    const navigate = useNavigate()
    const { login } = useFetchv2()
    const { setAuth } = useContext(AuthContext)

    const [form, setForm] = useState('login')
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })

    const toggleForm = () => {
        var actual = form === 'login' ? 'reg' : 'login'
        setForm(actual)
    }

    const handleLoginData = ({ target }) => {
        setLoginData({
            ...loginData,
            [target.name]: target.value
        })
    }

    // TODO: django validation fields

    const handleLogin = (e) => {
        e.preventDefault()
        if (loginData.email.length > 0 && loginData.password.length > 0)
            login(loginData).then((res) => {
                LocalStorage.set('auth', res)
                setAuth(res)
                navigate('/')
            })
    }

    if (form === 'login') {
        return (
            <form onSubmit={handleLogin}>
                <br />
                <div className="block">
                    {/* <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2560px-Instagram_logo.svg.png" alt="" className="logo" /> */}
                    <div className="inputs">
                        <input type="text" name="email" onChange={handleLoginData} value={loginData.email} placeholder="Teléfono, usuario o correo electrónico" />
                        <input type="password" name="password" onChange={handleLoginData} value={loginData.password} placeholder="Contraseña" />
                        <button onClick={handleLogin}>Iniciar sesión</button>
                        <a className="link2" href="#">¿Olvidaste tu contraseña?</a>
                    </div>
                </div>
                <div className="block">
                    ¿No tienes una cuenta? <a onClick={toggleForm} href="#">Registrate</a>
                </div>
            </form>
        )
    } else return (<RegForm change={toggleForm} />)
}