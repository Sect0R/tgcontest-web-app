import Rusha from 'rusha';
import CryptoJS from 'crypto-js';
import {BigInteger, SecureRandom} from 'jsbn';

export const Crypto = {
    rushaInstance: null,

    sha1Hash(bytes) {
        this.rushaInstance = this.rushaInstance || new Rusha(1024 * 1024);

        return Promise.resolve(
            this.rushaInstance.rawDigest(bytes).buffer
        );
    },

    sha256Hash(bytes) {
        const hashWords = CryptoJS.SHA256(this.bytesToWords(bytes));

        return Promise.resolve(
            this.bytesFromWords(hashWords)
        );
    },

    aesEncrypt(bytes, keyBytes, ivBytes) {
        return Promise.resolve(
            this.convertToArrayBuffer(
                this.aesEncryptSync(bytes, keyBytes, ivBytes)
            )
        );
    },

    aesDecrypt(encryptedBytes, keyBytes, ivBytes) {
        return Promise.resolve(
            this.convertToArrayBuffer(
                this.aesDecryptSync(encryptedBytes, keyBytes, ivBytes)
            )
        );
    },

    factorize(bytes) {
        bytes = this.convertToByteArray(bytes);

        return Promise.resolve(
            this.pqPrimeFactorization(bytes)
        );
    },

    modPow(x, y, m) {
        try {
            const xBigInt = str2bigInt(this.bytesToHex(x), 16);
            const yBigInt = str2bigInt(this.bytesToHex(y), 16);
            const mBigInt = str2bigInt(this.bytesToHex(m), 16);
            const resBigInt = powMod(xBigInt, yBigInt, mBigInt);

            return bytesFromHex(bigInt2str(resBigInt, 16));
        } catch (e) {
            console.error('mod pow error', e);
        }

        return Promise.resolve(
            this.bytesFromBigInt(new BigInteger(x).modPow(new BigInteger(y), new BigInteger(m)), 256)
        );
    },

    bigint(num) {
        return new BigInteger(num.toString(16), 16);
    },

    bigStringInt(strNum) {
        return new BigInteger(strNum, 10);
    },

    bytesToHex(bytes) {
        bytes = bytes || [];

        const arr = [];
        for (let i = 0; i < bytes.length; i++) {
            arr.push((bytes[i] < 16 ? '0' : '') + (bytes[i] || 0).toString(16));
        }

        return arr.join('');
    },

    bytesFromHex(hexString) {
        const len = hexString.length;
        const bytes = [];
        let start = 0;

        if (hexString.length % 2) {
            bytes.push(parseInt(hexString.charAt(0), 16));
            start++;
        }

        for (let i = start; i < len; i += 2) {
            bytes.push(parseInt(hexString.substr(i, 2), 16));
        }

        return bytes;
    },

    bytesCmp(bytes1, bytes2) {
        const len = bytes1.length;

        if (len !== bytes2.length) {
            return false;
        }

        for (let i = 0; i < len; i++) {
            if (bytes1[i] != bytes2[i]) {
                return false;
            }
        }
        return true;
    },

    bytesXor(bytes1, bytes2) {
        var len = bytes1.length;
        var bytes = [];

        for (let i = 0; i < len; ++i) {
            bytes[i] = bytes1[i] ^ bytes2[i];
        }

        return bytes;
    },

    bytesToWords(bytes) {
        if (bytes instanceof ArrayBuffer) {
            bytes = new Uint8Array(bytes);
        }

        const len = bytes.length;
        const words = [];

        for (let i = 0; i < len; i++) {
            words[i >>> 2] |= bytes[i] << (24 - (i % 4) * 8);
        }

        return new CryptoJS.lib.WordArray.init(words, len);
    },

    bytesFromWords(wordArray) {
        const words = wordArray.words;
        const sigBytes = wordArray.sigBytes;
        const bytes = [];

        for (let i = 0; i < sigBytes; i++) {
            bytes.push((words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff);
        }

        return bytes;
    },

    bytesFromBigInt(bigInt, len) {
        let bytes = bigInt.toByteArray();

        if (len && bytes.length < len) {
            const padding = [];

            for (let i = 0, needPadding = len - bytes.length; i < needPadding; i++) {
                padding[i] = 0;
            }

            if (bytes instanceof ArrayBuffer) {
                bytes = this.bufferConcat(padding, bytes);
            } else {
                bytes = padding.concat(bytes);
            }

        } else {
            while (!bytes[0] && (!len || bytes.length > len)) {
                bytes = bytes.slice(1);
            }
        }

        return bytes;
    },

    bytesToArrayBuffer(b) {
        return (new Uint8Array(b)).buffer;
    },

    convertToArrayBuffer(bytes) {
        if (bytes instanceof ArrayBuffer) {
            return bytes;
        }

        if (bytes.buffer !== undefined &&
            bytes.buffer.byteLength === bytes.length * bytes.BYTES_PER_ELEMENT) {
            return bytes.buffer;
        }

        return this.bytesToArrayBuffer(bytes);
    },

    convertToUint8Array(bytes) {
        if (bytes.buffer !== undefined) {
            return bytes;
        }

        return new Uint8Array(bytes);
    },

    convertToByteArray(bytes) {
        if (Array.isArray(bytes)) {
            return bytes;
        }

        bytes = this.convertToUint8Array(bytes);

        const newBytes = [];

        for (let i = 0, len = bytes.length; i < len; i++) {
            newBytes.push(bytes[i]);
        }

        return newBytes;
    },

    bytesFromArrayBuffer(buffer) {
        const byteView = new Uint8Array(buffer);
        const bytes = [];

        for (let i = 0; i < buffer.byteLength; ++i) {
            bytes[i] = byteView[i];
        }

        return bytes;
    },

    bufferConcat(buffer1, buffer2) {
        const l1 = buffer1.byteLength || buffer1.length;
        const l2 = buffer2.byteLength || buffer2.length;
        const tmp = new Uint8Array(l1 + l2);

        tmp.set(buffer1 instanceof ArrayBuffer ? new Uint8Array(buffer1) : buffer1, 0);
        tmp.set(buffer2 instanceof ArrayBuffer ? new Uint8Array(buffer2) : buffer2, l1);

        return tmp.buffer;
    },

    longToInts(sLong) {
        const divRem = this.bigStringInt(sLong).divideAndRemainder(this.bigint(0x100000000));

        return [divRem[0].intValue(), divRem[1].intValue()];
    },

    longToBytes(sLong) {
        return this.bytesFromWords({words: this.longToInts(sLong), sigBytes: 8}).reverse();
    },

    longFromInts(high, low) {
        return this.bigint(high).shiftLeft(32).add(this.bigint(low)).toString(10);
    },

    intToUint(val) {
        val = parseInt(val);

        if (val < 0) {
            val = val + 4294967296;
        }

        return val;
    },

    uintToInt(val) {
        if (val > 2147483647) {
            val = val - 4294967296;
        }

        return val;
    },

    sha1BytesSync(bytes) {
        this.sha1Hash(bytes).then((result) => {
            return this.bytesFromArrayBuffer(result);
        });
    },

    rsaEncrypt(publicKey, bytes) {
        bytes = this.addPadding(bytes, 255);

        const N = new BigInteger(publicKey.modulus, 16);
        const E = new BigInteger(publicKey.exponent, 16);
        const X = new BigInteger(bytes);

        const encryptedBigInt = X.modPowInt(E, N);

        return this.bytesFromBigInt(encryptedBigInt, 256);
    },

    addPadding(bytes, blockSize, zeroes) {
        blockSize = blockSize || 16;
        const len = bytes.byteLength || bytes.length;
        const needPadding = blockSize - (len % blockSize);

        if (needPadding > 0 && needPadding < blockSize) {
            const padding = new Array(needPadding);
            if (zeroes) {
                for (let i = 0; i < needPadding; i++) {
                    padding[i] = 0
                }
            } else {
                (new SecureRandom()).nextBytes(padding);
            }

            if (bytes instanceof ArrayBuffer) {
                bytes = this.bufferConcat(bytes, padding);
            } else {
                bytes = bytes.concat(padding);
            }
        }

        return bytes;
    },

    aesEncryptSync(bytes, keyBytes, ivBytes) {
        bytes = this.addPadding(bytes);

        const encryptedWords = CryptoJS.AES.encrypt(
            this.bytesToWords(bytes),
            this.bytesToWords(keyBytes),
            {
                iv: this.bytesToWords(ivBytes),
                padding: CryptoJS.pad.NoPadding,
                mode: CryptoJS.mode.IGE // TODO: ????
            }
        ).ciphertext;

        return this.bytesFromWords(encryptedWords);
    },

    aesDecryptSync(encryptedBytes, keyBytes, ivBytes) {

        // console.log(dT(), 'AES decrypt start', encryptedBytes.length);
        const decryptedWords =
            CryptoJS.AES.decrypt(
                {
                    ciphertext: this.bytesToWords(encryptedBytes)
                },
                this.bytesToWords(keyBytes),
                {
                    iv: this.bytesToWords(ivBytes),
                    padding: CryptoJS.pad.NoPadding,
                    mode: CryptoJS.mode.IGE // TODO ??
                }
            );

        return this.bytesFromWords(decryptedWords);
    },

    gzipUncompress(bytes) {
        return (new Zlib.Gunzip(bytes)).decompress();
    },

    nextRandomInt(maxValue) {
        return Math.floor(Math.random() * maxValue);
    },

    pqPrimeFactorization(pqBytes) {
        var what = new BigInteger(pqBytes);

        console.log(dateTime(), 'PQ start', pqBytes, what.toString(16), what.bitLength());

        var it = 0,
            g;
        for (var i = 0; i < 3; i++) {
            var q = (nextRandomInt(128) & 15) + 17,
                x = bigint(nextRandomInt(1000000000) + 1),
                y = x.clone(),
                lim = 1 << (i + 18);

            for (var j = 1; j < lim; j++) {
                ++it;
                var a = x.clone(),
                    b = x.clone(),
                    c = bigint(q);

                while (!b.equals(BigInteger.ZERO)) {
                    if (!b.and(BigInteger.ONE).equals(BigInteger.ZERO)) {
                        c = c.add(a);
                        if (c.compareTo(what) > 0) {
                            c = c.subtract(what);
                        }
                    }

                    a = a.add(a);
                    if (a.compareTo(what) > 0) {
                        a = a.subtract(what);
                    }

                    b = b.shiftRight(1);
                }

                x = c.clone();
                const z = x.compareTo(y) < 0 ? y.subtract(x) : x.subtract(y);
                g = z.gcd(what);
                if (!g.equals(BigInteger.ONE)) {
                    break;
                }

                if ((j & (j - 1)) === 0) {
                    y = x.clone();
                }
            }

            if (g.compareTo(BigInteger.ONE) > 0) {
                break;
            }
        }

        var f = what.divide(g), P, Q;

        if (g.compareTo(f) > 0) {
            P = f;
            Q = g;
        } else {
            P = g;
            Q = f;
        }

        return [bytesFromBigInt(P), bytesFromBigInt(Q), it];
    },
};
