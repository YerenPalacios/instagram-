export const LOGIN_PATH = 'login/'
export const SIGN_PATH = 'sign-up/'
export const NO_AUTH_PATHS = [SIGN_PATH, LOGIN_PATH, 'user-exists/']

export const API_URL = process.env.REACT_APP_API_URL ?? "http://192.168.80.11:8000/"
export const WS_API_URL = process.env.REACT_APP_API_URL_WS ?? "ws://192.168.80.11:8000/ws/"