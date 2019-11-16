export const Config = {
    app: {
        id: _APP_ID_,
        hash: _APP_HASH_,
        server: {
            test: _APP_TEST_SERVER_,
            production: _APP_PROD_SERVER_,
        },
    },
    tdweb: {
        useTestDC: false,
        readOnly: false,
        logVerbosityLevel: 1,
        jsLogVerbosityLevel: 3,
        fastUpdating: true,
        useDatabase: false,
        mode: 'wasm',
        prefix: tdlib,
        isBackground: false,
        wasmUrl: `b4b0d61282108a31908dd6b2dbd7067b.wasm?_sw-precache=b4b0d61282108a31908dd6b2dbd7067b`
    },
};
