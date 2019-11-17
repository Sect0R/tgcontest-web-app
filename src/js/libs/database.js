export const Database = {
    dbname: 'tgdb',

    exists(callback) {
        const request = window.indexedDB.open(this.dbname);

        let exist = true;

        request.onsuccess = function() {
            request.result.close();

            if (!exist) window.indexedDB.deleteDatabase(this.dbname);
            callback(exist);
        };

        request.onupgradeneeded = function() {
            exist = false;
        };
    },

    openDB() {
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open(this.dbname);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
};
