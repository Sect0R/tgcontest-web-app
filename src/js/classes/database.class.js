export class Database {
    static dbname = 'tdlib';

    exists(callback) {
        const request = indexedDB.open(self::dbname);

        let exist = true;

        request.onsuccess = function() {
            request.result.close();

            if (!exist) indexedDB.deleteDatabase(self::dbname);
            callback(exist);
        };

        request.onupgradeneeded = function() {
            exist = false;
        };
    }
}
