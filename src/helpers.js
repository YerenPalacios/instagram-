import api from './api.json'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { ApiErrorContext, AuthContext } from './context/datacontext'

const getUser = () => {
    let auth = localStorage.getItem('auth')
    if (auth) {
        let user = JSON.parse(auth)
        return user
    }
}

export const getToken = () => {
    const user = getUser()
    return user && 'Token ' + user.token
}

export const getUserSesion = () => {
    let authData = localStorage.getItem('auth')
    if (authData) {
        return JSON.parse(authData)
    }
    window.location.href = '/login'
}

export function UpdateUserSesion(user) {
    let authData = localStorage.getItem('auth')
    if (authData) {
        authData = JSON.parse(authData)
        user.image = user.image.replace(api.url, '')
        authData.user = user
        localStorage.setItem('auth', JSON.stringify(authData))
        return true
    }
    return false
}

const LOGIN_PATH = 'login/'
const SIGN_PATH = 'sign-up/'

export const useFetch = (auto_errors = true) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const { auth } = useContext(AuthContext)
    const { error, setError } = useContext(ApiErrorContext)

    /**
     * @param {string} path
     * @param {object} options
     */
    const runFetch = (path, options = {}) => {
        if (path !== LOGIN_PATH && path !== SIGN_PATH && !auth)
            return navigate('/login')

        return fetch(
            api.url + path, options
        ).then(res => {
            if (res.status >= 500) throw setError('Ha ocurrido un error')
            if (res.status >= 400 && auto_errors)
                // TODO: think how to use 400 errors
                throw res.json().then((data => {
                    setError(JSON.stringify(data))
                }))
            else return res.json()
        }).catch(e => { throw setError(e.toString()) }
        ).finally(() => setLoading(false))
    }

    const login = (body) => {
        setLoading(true);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }

        return runFetch(LOGIN_PATH, options)
    }

    const sign = (body) => {
        setLoading(true);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }

        return runFetch(SIGN_PATH, options)
    }

    const get = (path) => {
        setLoading(true);
        const options = {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + auth.token
            }
        }
        return runFetch(path, options)
    }

    const post = (path, body = {}) => {
        setLoading(true);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth.token,
            },
            body: JSON.stringify(body)
        }

        return runFetch(path, options)
    }

    const remove = (path, body = {}) => {
        setLoading(true);
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth.token,
            },
            body: JSON.stringify(body)
        }

        return runFetch(path, options)
    }

    return { get, post, remove, login, sign, error, loading, setLoading };
}