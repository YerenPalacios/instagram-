import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import './loginForm.scss'
import { AuthContext } from "../../context/datacontext";
import { useFetch } from "../../helpers";
import { LocalStorage } from "../../services/LocalStorage.service";
import { useRef } from "react";

function RegForm() {
    const navigate = useNavigate()
    const { setAuth } = useContext(AuthContext)
    const { sign } = useFetch()

    const email_or_tel = useRef()
    const nameInput = useRef()
    const usernameInput = useRef()
    const passInput = useRef()

    const handleSign = e => {
        e.preventDefault()
        let email = email_or_tel.current.value.includes('@') && email_or_tel.current.value
        let phone = !email_or_tel.current.value.includes('@') && email_or_tel.current.value;
        let name = nameInput.current.value
        let username = usernameInput.current.value
        let password = passInput.current.value

        if (email.length || phone.length && name.length && password.length) {
            sign({ ...email ? { email } : { phone }, name, username, password }).then(data=>{
                LocalStorage.set('auth', data)
                setAuth(data)
                navigate('/')
            })
        }
    }

    return (
        <form onSubmit={handleSign}>
            <p className="desc">Regístrate para ver fotos y videos de tus amigos.</p>
            <div className="inputs">
                <input ref={email_or_tel} type="text" placeholder="Número de celular o correo electrónico" />
                <input ref={nameInput} type="text" placeholder="Nombre completo" />
                <input ref={usernameInput} type="text" placeholder="Nombre de usuairio" />
                <input ref={passInput} type="text" placeholder="Contraseña" />
                <button>Registrarse</button>
            </div>
        </form>
    )
}

function LoginForm() {
    const navigate = useNavigate()
    const { login } = useFetch()
    const { setAuth } = useContext(AuthContext)
    const emailInput = useRef()
    const passInput = useRef()

    const handleLogin = (e) => {
        let email = emailInput.current.value
        let password = passInput.current.value
        e.preventDefault()
        if (email.length > 0 && password.length > 0)
            login({ email, password }).then(data => {
                LocalStorage.set('auth', data)
                setAuth(data)
                navigate('/')
            })
    }

    return (
        <form>
            <div className="inputs">
                <input type="text" name="email" ref={emailInput} placeholder="Teléfono, usuario o correo electrónico" />
                <input type="password" name="password" ref={passInput} placeholder="Contraseña" />
                <button onClick={handleLogin}>Iniciar sesión</button>
                <a className="link2" href="#">¿Olvidaste tu contraseña?</a>
            </div>
        </form>
    )
}

export default function FormContainer() {


    const [form, setForm] = useState('login')


    const toggleForm = () => {
        var actual = form === 'login' ? 'reg' : 'login'
        setForm(actual)
    }

    // TODO: django validation fields

    return <div className="formContainer">
        <div className="block">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2560px-Instagram_logo.svg.png" alt="" className="logo" />
            {form === 'reg' ? <RegForm /> : <LoginForm />}
        </div>
        <div className="block">
            {form === 'reg' ?
                <p>¿Tienes una cuenta? <span href="#" onClick={toggleForm}>Inicia sesión</span></p> :
                <p>¿No tienes una cuenta? <span onClick={toggleForm} href="#">Registrate</span></p>
            }
        </div>
    </div>
}