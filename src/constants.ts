export const LOGIN_PATH = 'login/'
export const SIGN_PATH = 'sign-up/'
export const NO_AUTH_PATHS = [SIGN_PATH, LOGIN_PATH]

export const API_URL = process.env.REACT_APP_API_URL ?? "https://localhost:9000/ws/"
export const WS_API_URL = process.env.REACT_APP_API_URL ?? "ws://localhost:9000/ws/"