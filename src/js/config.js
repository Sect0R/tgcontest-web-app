export const Config = {
    app: {
        id: _APP_ID_,
        hash: _APP_HASH_,
        version: _APP_VERSION_,
        server: _APP_SERVER_,
    },
    modes: {
        debug: location.search.indexOf('debug=1') > 0,
        http: location.protocol !== 'https:',
        ssl: location.protocol === 'https:',
        nacl: location.search.indexOf('nacl=0') == -1,
        webcrypto: location.search.indexOf('webcrypto=0') == -1,
        memory_only: false,
        allow_tmpfs: location.search.indexOf('tmpfs=yeahImSureIknowWhatImDoing') > 0 || false,
    }
};

