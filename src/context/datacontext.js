import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api.json'
import { LocalStorage } from "../services/LocalStorage.service";

const HEADERS = {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST'
}

const post = (path, data, url = api.url,) => {
    return fetch(url + path, {
        ...HEADERS,
        body: JSON.stringify(data)
    }).then(res => {
        if (!res.ok) throw new Error('Error al buscar usuario')
        return res.json()
    })
}

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate()
    const [auth, setAuth] = useState(LocalStorage.get('auth'))

    const login = (data) => {
        post('login/', data).then((res) => {
            LocalStorage.set('auth', res)
            setAuth(res)
            navigate('/')
        })
    }

    return <AuthContext.Provider value={{ auth, setAuth, login }}>{children}</AuthContext.Provider>
}


export const ApiErrorContext = createContext()

export const ApiErrorProvider = ({ children }) => {
    const [error, setError] = useState(null)
    return <ApiErrorContext.Provider value={{ error, setError }}>{children}</ApiErrorContext.Provider>
}