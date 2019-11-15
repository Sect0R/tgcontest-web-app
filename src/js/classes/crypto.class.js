

export class Crypto {

    sha1Hash(bytes) {
        return Promise.resolve(this.sha1HashSync(bytes));
    }

    sha256Hash(bytes) {
        return Promise.resolve(this.sha256HashSync(bytes));
    }

    aesEncrypt(bytes, keyBytes, ivBytes) {
        return Promise.resolve(this.convertToArrayBuffer(this.aesEncryptSync(bytes, keyBytes, ivBytes)));
    }

    aesDecrypt(encryptedBytes, keyBytes, ivBytes) {
        return Promise.resolve(this.convertToArrayBuffer(this.aesDecryptSync(encryptedBytes, keyBytes, ivBytes)));
    }

    factorize(bytes) {
        bytes = this.convertToByteArray(bytes);

        return Promise.resolve(this.pqPrimeFactorization(bytes));
    }

    modPow(x, y, m) {
        return Promise.resolve(this.bytesModPow(x, y, m));
    }

    ////

    bigint(num) {
        return new BigInteger(num.toString(16), 16);
    }

    bigStringInt(strNum) {
        return new BigInteger(strNum, 10);
    }

    bytesToHex(bytes) {
        bytes = bytes || [];
        var arr = [];
        for (var i = 0; i < bytes.length; i++) {
            arr.push((bytes[i] < 16 ? '0' : '') + (bytes[i] || 0).toString(16));
        }
        return arr.join('');
    }

    bytesFromHex(hexString) {
        var len = hexString.length,
            i,
            start = 0,
            bytes = [];

        if (hexString.length % 2) {
            bytes.push(parseInt(hexString.charAt(0), 16));
            start++;
        }

        for (i = start; i < len; i += 2) {
            bytes.push(parseInt(hexString.substr(i, 2), 16));
        }

        return bytes;
    }

    bytesCmp(bytes1, bytes2) {
        var len = bytes1.length;
        if (len !== bytes2.length) {
            return false;
        }

        for (var i = 0; i < len; i++) {
            if (bytes1[i] != bytes2[i]) {
                return false;
            }
        }
        return true;
    }

    bytesXor(bytes1, bytes2) {
        var len = bytes1.length,
            bytes = [];

        for (var i = 0; i < len; ++i) {
            bytes[i] = bytes1[i] ^ bytes2[i];
        }

        return bytes;
    }

    bytesToWords(bytes) {
        if (bytes instanceof ArrayBuffer) {
            bytes = new Uint8Array(bytes);
        }
        var len = bytes.length,
            words = [], i;
        for (i = 0; i < len; i++) {
            words[i >>> 2] |= bytes[i] << (24 - (i % 4) * 8);
        }

        return new CryptoJS.lib.WordArray.init(words, len);
    }

    bytesFromWords(wordArray) {
        var words = wordArray.words,
            sigBytes = wordArray.sigBytes,
            bytes = [];

        for (var i = 0; i < sigBytes; i++) {
            bytes.push((words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff);
        }

        return bytes;
    }

    bytesFromBigInt(bigInt, len) {
        var bytes = bigInt.toByteArray();

        if (len && bytes.length < len) {
            var padding = [];
            for (var i = 0, needPadding = len - bytes.length; i < needPadding; i++) {
                padding[i] = 0;
            }
            if (bytes instanceof ArrayBuffer) {
                bytes = bufferConcat(padding, bytes);
            } else {
                bytes = padding.concat(bytes);
            }
        } else {
            while (!bytes[0] && (!len || bytes.length > len)) {
                bytes = bytes.slice(1);
            }
        }

        return bytes;
    }

    bytesToArrayBuffer(b) {
        return (new Uint8Array(b)).buffer;
    }

    convertToArrayBuffer(bytes) {
        if (bytes instanceof ArrayBuffer) {
            return bytes;
        }
        if (bytes.buffer !== undefined &&
            bytes.buffer.byteLength === bytes.length * bytes.BYTES_PER_ELEMENT) {
            return bytes.buffer;
        }
        return bytesToArrayBuffer(bytes);
    }

    convertToUint8Array(bytes) {
        if (bytes.buffer !== undefined) {
            return bytes;
        }
        return new Uint8Array(bytes);
    }

    convertToByteArray(bytes) {
        if (Array.isArray(bytes)) {
            return bytes;
        }

        bytes = convertToUint8Array(bytes);

        const newBytes = [];
        for (let i = 0, len = bytes.length; i < len; i++) {
            newBytes.push(bytes[i]);
        }

        return newBytes;
    }

    bytesFromArrayBuffer(buffer) {
        var len = buffer.byteLength,
            byteView = new Uint8Array(buffer),
            bytes = [];

        for (var i = 0; i < len; ++i) {
            bytes[i] = byteView[i];
        }

        return bytes;
    }

    bufferConcat(buffer1, buffer2) {
        const l1 = buffer1.byteLength || buffer1.length;
        const l2 = buffer2.byteLength || buffer2.length;
        const tmp = new Uint8Array(l1 + l2);
        tmp.set(buffer1 instanceof ArrayBuffer ? new Uint8Array(buffer1) : buffer1, 0);
        tmp.set(buffer2 instanceof ArrayBuffer ? new Uint8Array(buffer2) : buffer2, l1);

        return tmp.buffer;
    }

    longToInts(sLong) {
        var divRem = bigStringInt(sLong).divideAndRemainder(bigint(0x100000000));

        return [divRem[0].intValue(), divRem[1].intValue()];
    }

    longToBytes(sLong) {
        return bytesFromWords({words: longToInts(sLong), sigBytes: 8}).reverse();
    }

    longFromInts(high, low) {
        return bigint(high).shiftLeft(32).add(bigint(low)).toString(10);
    }

    intToUint(val) {
        val = parseInt(val);
        if (val < 0) {
            val = val + 4294967296;
        }
        return val;
    }

    uintToInt(val) {
        if (val > 2147483647) {
            val = val - 4294967296;
        }
        return val;
    }

    sha1HashSync(bytes) {
        this.rushaInstance = this.rushaInstance || new Rusha(1024 * 1024);
        return rushaInstance.rawDigest(bytes).buffer;
    }

    sha1BytesSync(bytes) {
        return bytesFromArrayBuffer(sha1HashSync(bytes));
    }

    sha256HashSync(bytes) {
        const hashWords = CryptoJS.SHA256(bytesToWords(bytes));

        return bytesFromWords(hashWords);
    }

    rsaEncrypt(publicKey, bytes) {
        bytes = addPadding(bytes, 255);

        const N = new BigInteger(publicKey.modulus, 16);
        const E = new BigInteger(publicKey.exponent, 16);
        const X = new BigInteger(bytes);

        const encryptedBigInt = X.modPowInt(E, N);

        return bytesFromBigInt(encryptedBigInt, 256);
    }

    addPadding(bytes, blockSize, zeroes) {
        blockSize = blockSize || 16;
        var len = bytes.byteLength || bytes.length;
        var needPadding = blockSize - (len % blockSize);
        if (needPadding > 0 && needPadding < blockSize) {
            var padding = new Array(needPadding);
            if (zeroes) {
                for (var i = 0; i < needPadding; i++) {
                    padding[i] = 0
                }
            } else {
                (new SecureRandom()).nextBytes(padding);
            }

            if (bytes instanceof ArrayBuffer) {
                bytes = bufferConcat(bytes, padding);
            } else {
                bytes = bytes.concat(padding);
            }
        }

        return bytes;
    }

    aesEncryptSync(bytes, keyBytes, ivBytes) {
        bytes = addPadding(bytes);

        var encryptedWords = CryptoJS.AES.encrypt(bytesToWords(bytes), bytesToWords(keyBytes), {
            iv: bytesToWords(ivBytes),
            padding: CryptoJS.pad.NoPadding,
            mode: CryptoJS.mode.IGE
        }).ciphertext;

        return bytesFromWords(encryptedWords);
    }

    aesDecryptSync(encryptedBytes, keyBytes, ivBytes) {

        // console.log(dT(), 'AES decrypt start', encryptedBytes.length);
        var decryptedWords = CryptoJS.AES.decrypt({ciphertext: bytesToWords(encryptedBytes)}, bytesToWords(keyBytes), {
            iv: bytesToWords(ivBytes),
            padding: CryptoJS.pad.NoPadding,
            mode: CryptoJS.mode.IGE
        });

        return bytesFromWords(decryptedWords);
    }

    gzipUncompress(bytes) {
        return (new Zlib.Gunzip(bytes)).decompress();
    }

    nextRandomInt(maxValue) {
        return Math.floor(Math.random() * maxValue);
    }

    pqPrimeFactorization(pqBytes) {
        var what = new BigInteger(pqBytes);

        console.log(dT(), 'PQ start', pqBytes, what.toString(16), what.bitLength());

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
                var z = x.compareTo(y) < 0 ? y.subtract(x) : x.subtract(y);
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
    }


    bytesModPow(x, y, m) {
        try {
            var xBigInt = str2bigInt(bytesToHex(x), 16),
                yBigInt = str2bigInt(bytesToHex(y), 16),
                mBigInt = str2bigInt(bytesToHex(m), 16),
                resBigInt = powMod(xBigInt, yBigInt, mBigInt);

            return bytesFromHex(bigInt2str(resBigInt, 16));
        } catch (e) {
            console.error('mod pow error', e);
        }

        return bytesFromBigInt(new BigInteger(x).modPow(new BigInteger(y), new BigInteger(m)), 256);
    }

}
