import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { ApiErrorContext, AuthContext } from './context/datacontext'
import { API_URL, LOGIN_PATH, NO_AUTH_PATHS, SIGN_PATH } from './constants'

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

export function UpdateUserSesion(user: User) {
    let authData = localStorage.getItem('auth')
    if (authData) {
        let authDataObj = JSON.parse(authData)
        user.image = user.image.replace(API_URL, '')
        authDataObj.user = user
        localStorage.setItem('auth', JSON.stringify(authData))
        return true
    }
    return false
}

export const useFetch = (auto_errors = true) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const controller = new AbortController()
    const { auth } = useContext(AuthContext)
    const { error, setError } = useContext(ApiErrorContext)

    useEffect(() => {
        return () => {
            if (controller) controller.abort()
        };
    }, []);

    const runFetch = (path: string, options = {}):Promise<any> => {

        return new Promise((resolve, reject) => {
            
            if (!auth && !NO_AUTH_PATHS.includes(path)) {
                navigate('/login')
                reject(new Error('nada'))
            } else {
                resolve(
                    fetch(
                        API_URL + path, { signal: controller?.signal, ...options },
                    ).then(res => {

                        if (res.status >= 500) { throw setError('¡Ha ocurrido un error!') }
                        if (res.status >= 400 && auto_errors)
                            res.json().then((data => {
                                throw setError(data[Object.keys(data)[0]])
                            }))
                        else return res.json()
                    }).catch(e => {
                        throw setError('¡Ha ocurrido un error!')
                    }).finally(() => setLoading(false))
                )
            }


        })
    }

    const login = (body: Object) => {
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

    const sign = (body: Object) => {
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

    const get = (path: string) => {
        setLoading(true);
        const options = {
            method: 'GET',
            headers: {
                'Authorization': auth ? 'Token ' + auth.token : ''
            }
        }
        return runFetch(path, options)
    }

    const sendRecoveryEmail = (body: Object) => {
        setLoading(true);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }

        return runFetch('/recovery-password', options)
    }

    const post = (path: string, body = {}) => {
        setLoading(true);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth?.token,
            },
            body: JSON.stringify(body)
        }

        return runFetch(path, options)
    }

    const remove = (path: string, body = {}) => {
        setLoading(true);
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + auth?.token,
            },
            body: JSON.stringify(body)
        }

        return runFetch(path, options)
    }

    return { get, post, remove, login, sign, error, loading, setLoading, sendRecoveryEmail };
}

export function getUserImage(data: User) {
    // TODO: add user color field??
    if (data.image) return data.image.includes('http') ? data.image : API_URL + data.image
    const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    const letter = data.username?.slice(0, 1).toUpperCase()
    const b = `<svg height="100" width="100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" style="fill:${color}" />
    <text x="50%" y="57%" alignment-baseline="middle" fill="#fff" text-anchor="middle" font-size='40px' font-family='sans-serif'>${letter}</text>
    </svg>`
    const blob = new Blob([b], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)

    setTimeout(() => {
        URL.revokeObjectURL(url)
    }, 10000);

    return url
}
