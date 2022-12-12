import api from './api.json'
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'

const getUser = ()=>{
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


export function useFetch(url=null,options = null, repeat = false) {
    const navigate = useNavigate()
    const [data, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [repeating, setRepeating] = useState(false)

    const fetchData = async () => {
        const token = getToken()

        if (!token) navigate('/login')

        const defaultOptions = {
            method: 'GET',
            headers:{
                'Authorization':token
            },
        }
        if (!options) options = defaultOptions;

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

    if (repeat) setTimeout(() => {
        setRepeating(!repeating)
    }, 1000);

    useEffect(() => {
        
        fetchData();
       
    }, [url, repeating]); 

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