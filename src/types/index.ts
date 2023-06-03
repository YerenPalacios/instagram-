type User = {
    description: string,
    email: string
    following: boolean,
    id: number,
    image: string,
    is_active: boolean,
    is_superuser: boolean,
    last_login: null | string,
    name: string,
    phone: string,
    username: string
}

type Auth = {
    token: string,
    user: User
};