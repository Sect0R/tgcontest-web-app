function $qModule() {
    return {
        defer: function () {
            var resolver, rejector;
            var promise = new Promise(function(resolve, reject) {
                resolver = resolve;
                rejector = reject;
            });
            var deferred = {
                resolve: resolver,
                reject: rejector,
                then: function(a, b) { promise = promise.then(a, b); return deferred; },
                pipe: function(a, b) { promise = promise.then(a, b); return deferred; },
                done: function(a) { promise = promise.then(a, b); return deferred; },
                fail: function(a) { promise = promise.catch(a); return deferred; },
                always: function(a) { promise = promise.finally(a); return deferred; },
                // promise: function() { return promise; }
            };
            deferred.promise = deferred;
            return deferred;
        },
        when: Promise.resolve,
        reject: function (result) {
            return this.defer().reject(result);
        },
        all: function (promises) {
            if (isArray(promises)) {
                return Promise.all(promises);
            }

            var p = [];
            var keys = Object.keys(promises);
            
            forEach(keys, function (key) {
                p.push(promises[key]);
            });

            return this.all(p).then(function () {
                var objects = toArray(arguments);
                var result = {};
                
                forEach(keys, function (key, i) {
                    result[key] = objects[i];
                });

                return result;
            });
        }
    };
}
