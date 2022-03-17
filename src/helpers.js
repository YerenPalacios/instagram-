import api from './api.json'
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'


export const getToken = () => {
    let user = JSON.parse(localStorage.getItem('auth'))
    return 'Token ' + user.token
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


export function useFetch(url=null, options) {
    const navigate = useNavigate()
    const [data, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const defaultOptions = {
        method: 'GET',
        headers:{
            'Authorization':getToken()
        },
    }

    if (!options) options = defaultOptions;

    useEffect(() => {
        const fetchData = async () => {
            if (url){
                setIsLoading(true);
                try {
                    const res = await fetch(api.url+url, options);
                    if (!res.ok) throw(res)
                    const json = await res.json();
                    setResponse(json);
                    setIsLoading(false);
                } catch (error) { 
                    setIsLoading(false)  
                    setError(error);
                }
            }
        };
        fetchData();
       
    }, []); 

    // try one day...
    async function post(body){
        options = { 
            method: 'POST',
            headers: {
                'Authorization': getToken(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }
        setIsLoading(true);
        try {
            options.method = 'POST'
            const res = await fetch(api.url+url, options);
            if (!res.ok) throw(res)
            const json = await res.json();
            setResponse(json);
            setIsLoading(false);
        } catch (error) { 
            setIsLoading(false)  
            setError(error);
        }
    }

    if(error) if(error.status == 401) navigate('/login')
    return {post, data, error, isLoading };
}