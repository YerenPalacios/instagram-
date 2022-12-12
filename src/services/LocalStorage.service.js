export const LocalStorage = {
    get(key) {
        let item = localStorage.getItem(key)
        if (item) JSON.parse(item)
    },
    set(key, value) {
        value = JSON.stringify(value)
        localStorage.setItem(key, value)
    },
    remove(key) {localStorage.removeItem(key)},
    clear() {localStorage.clear()},
  }