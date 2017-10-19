export default class Cache {
    constructor() {
        this.data = {}
    }

    _string_key = k => JSON.stringify(k);


    keys = () => {
        return Object.keys(this.data)
    }

    get = k => {
        let obj = this.data[this._string_key(k)]
        return (obj && obj.expired_at > (new Date()).getTime()) ? obj.value : null
    }

    set = (k, v, seconds = Infinity) => {
        this.data[this._string_key(k)] = {
            value: v,
            expired_at: (new Date()).getTime() + (seconds * 1000)
        }
    }

    clear = () => {
        this.data = {}
    }
}

