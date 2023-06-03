export const LocalStorage = {
    get(key: string): Auth | undefined {
        let item = localStorage.getItem(key)
        if (item && item !== 'undefined') return JSON.parse(item)
    },
    set(key: string, value: Auth) {
        localStorage.setItem(key, JSON.stringify(value))
    },
    remove(key: string) { localStorage.removeItem(key) },
    clear() { localStorage.clear() },
}