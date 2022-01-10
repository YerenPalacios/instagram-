import api from './api.json'
export const getToken = () => {
    let user = JSON.parse(localStorage.getItem('auth'))
    return 'Token '+user.token
}

export const getUserSesion = () => {
    let authData = localStorage.getItem('auth')
    if (authData){
        return JSON.parse(authData)
    }
    window.location.href = '/login'    
}

export function UpdateUserSesion(user){
    let authData = localStorage.getItem('auth')
    if (authData){
        authData = JSON.parse(authData)
        user.image = user.image.replace(api.url,'')
        authData.user = user
        localStorage.setItem('auth', JSON.stringify(authData))
        return true
    }
    return false
}