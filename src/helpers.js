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