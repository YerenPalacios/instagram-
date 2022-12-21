import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api.json'
import { LocalStorage } from "../services/LocalStorage.service";


const post = (path, data, url = api.url,) => {
    return fetch(url + path, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(data)
    }).then(res => {
        if (!res.ok) throw new Error('Error al buscar usuario')
        return res.json()
    }).catch(e => {
        console.log(e)
    })
}

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(LocalStorage.get('auth'))

    return <AuthContext.Provider value={{ auth, setAuth, }}>{children}</AuthContext.Provider>
}


export const ApiErrorContext = createContext()

export const ApiErrorProvider = ({ children }) => {
    const [error, setError] = useState(null)
    return <ApiErrorContext.Provider value={{ error, setError }}>{children}</ApiErrorContext.Provider>
}