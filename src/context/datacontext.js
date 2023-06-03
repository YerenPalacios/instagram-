import { useEffect } from "react";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocalStorage } from "../services/LocalStorage.service";

const NO_AUTH_PATH = [
  '/login', '/password-reset'
]

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
    const [auth, setAuth] = useState(LocalStorage.get('auth'))
    useEffect(() => {

      if (!NO_AUTH_PATH.includes(window.location.pathname)){
        console.warn(NO_AUTH_PATH.includes(window.location.pathname), window.location.pathname)
        !auth ?? navigate('/login')
      }
      
    }, [])
    
    return <AuthContext.Provider value={{ auth, setAuth, }}>{children}</AuthContext.Provider>
}


export const ApiErrorContext = createContext()

export const ApiErrorProvider = ({ children }) => {
    const [error, setError] = useState(null)
    return <ApiErrorContext.Provider value={{ error, setError }}>{children}</ApiErrorContext.Provider>
}