export const Utils = {
    _logTimer: (new Date()).getTime(),

    dateTime() {
        return '[' + (((new Date()).getTime() - this._logTimer) / 1000).toFixed(3) + ']';
    },

    tsNow(seconds) {
        const t = +new Date();
        return seconds ? Math.floor(t / 1000) : t;
    },

    safeReplaceObject(wasObject, newObject) {
        for (let key in wasObject) {
            if (!newObject.hasOwnProperty(key) && key.charAt(0) !== '$') {
                delete wasObject[key];
            }
        }

        for (let key in newObject) {
            if (newObject.hasOwnProperty(key)) {
                wasObject[key] = newObject[key];
            }
        }
    },

    forEach(obj, iterator, context) {
        if (!obj) {
            return;
        }

        if (isArray(obj)) {
            if (obj.forEach) {
                obj.forEach(iterator, context, obj);
            } else {
                for (let i = 0; i < obj.length; i++) {
                    iterator.call(context, obj[i], i, obj);
                }
            }
        } else if (isObject(obj)) {
            for (const key in obj) {
                iterator.call(context, obj[key], key, obj);
            }
        }
    },

    isObject(value) {
        return value !== null && typeof value === 'object';
    },

    isArray(value) {
        return Array.isArray(value);
    },

    extend() {
        const objects = toArray(arguments);
        const obj = objects[0];

        for (let i = 1; i < objects.length; i++) {
            for (const key in objects[i]) {
                obj[key] = objects[i][key];
            }
        }

        return obj;
    },

    map(array, iterator) {
        const result = [];

        forEach(array, (obj) => {
            result.push(iterator(obj));
        });

        return result;
    },

};
