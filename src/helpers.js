import api from './api.json'
import { useState, useEffect } from 'react'
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


export function useFetch(path = null, options = null, repeat = false) {
    const navigate = useNavigate()
    const [data, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [repeating, setRepeating] = useState(false)
    const { auth } = useContext(AuthContext)

    const fetchData = () => {
        if (!auth) {
            navigate('/login')
            return
        }

        const defaultOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + auth.token
            },
        }
        if (!options) options = defaultOptions;

        if (path) {
            setIsLoading(true);
            let url = api.url + path
            try {

                fetch(url, options).then((res) => {
                    if (!res.ok) throw (res)
                    return res.json()
                }).then((data) => {
                    setResponse(data)
                });
                setIsLoading(false);
            } catch (error) {
                debugger
                setIsLoading(false)
                setError(error);
            }
        }
    };

    if (repeat) setTimeout(() => {
        setRepeating(!repeating)
    }, 1000);

    useEffect(() => {
        fetchData();

    }, [path, repeating]);

    // try one day...
    async function post(body) {
        options = {
            method: 'POST',
            headers: {
                'Authorization': 'Token ' + auth.token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }
        setIsLoading(true);
        try {
            options.method = 'POST'
            const res = await fetch(api.url + path, options);
            if (!res.ok) throw (res)
            const json = await res.json();
            setResponse(json);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false)
            setError(error);
        }
    }

    if (error) if (error.status === 401) navigate('/login')
    return { post, data, error, isLoading };
}


export const useFetchv2 = () => {
    const [data, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const { auth } = useContext(AuthContext)
    const { error, setError } = useContext(ApiErrorContext)

    /**
     * @param {string} path
     * @param {object} options
     */
    const runFetch = (path, options = {}) => {
        return fetch(
            api.url + path, options
        ).then((res) => {
            if (!res.ok) throw setError('Ha ocurrido un error')
            return res.json()
        }).finally(() => setLoading(false))
    }

    /**
     * @param {string} path
     */
    const get = (path) => {
        setLoading(true);
        const options = {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + auth.token
            }
        }
        runFetch(path, options)
    }

    /**
     * @param {string} path
     * @param {number?} body
     * @return {Promise}
     */
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

    /**
     * @param {string} path
     * @param {number?} body
     * @return {Promise}
     */
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

    return { get, post, remove, data, error, loading, setLoading };
}