export const Storage = {
    storagePrefix: '',
    cache: {},

    get() {
        const keys = Array.prototype.slice.call(arguments);
        const result = [];
        const single = keys.length === 1;

        let key;
        let value;

        for (let i = 0; i < keys.length; i++) {
            key = keys[i] = this.storagePrefix + keys[i];

            if (key.substr(0, 3) !== 'xt_' && this.cache[key] !== undefined) {
                result.push(this.cache[key]);
            } else {
                value = localStorage.getItem(key);

                try {
                    value = (value === undefined || value === null) ? false : JSON.parse(value);
                } catch (e) {
                    value = false;
                }

                result.push(this.cache[key] = value);
            }
        }

        return Promise.resolve(single ? result[0] : result);
    },

    set(obj) {
        let value;

        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                value = obj[key];
                key = this.storagePrefix + key;
                this.cache[key] = value;

                value = JSON.stringify(value);
                localStorage.setItem(key, value);
            }
        }
    },

    remove() {
        const keys = Array.prototype.slice.call(arguments);
        let callback;
        let key;

        if (typeof keys[keys.length - 1] === 'function') {
            callback = keys.pop();
        }

        for (let i = 0; i < keys.length; i++) {
            key = keys[i] = this.storagePrefix + keys[i];
            delete this.cache[key];
            localStorage.removeItem(key);
        }
    }
};
