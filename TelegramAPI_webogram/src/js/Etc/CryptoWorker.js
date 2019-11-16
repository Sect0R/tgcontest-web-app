function CryptoWorkerModule() {
    return {
        sha1Hash: function (bytes) {
            return Promise.resolve(sha1HashSync(bytes));
        },
        sha256Hash: function (bytes) {
            return Promise.resolve(sha256HashSync(bytes));
        },
        aesEncrypt: function (bytes, keyBytes, ivBytes) {
            return Promise.resolve(convertToArrayBuffer(aesEncryptSync(bytes, keyBytes, ivBytes)));
        },
        aesDecrypt: function (encryptedBytes, keyBytes, ivBytes) {
            return Promise.resolve(convertToArrayBuffer(aesDecryptSync(encryptedBytes, keyBytes, ivBytes)));
        },
        factorize: function (bytes) {
            bytes = convertToByteArray(bytes);

            return Promise.resolve(pqPrimeFactorization(bytes));
        },
        modPow: function (x, y, m) {
            return Promise.resolve(bytesModPow(x, y, m));
        }
    };
}
