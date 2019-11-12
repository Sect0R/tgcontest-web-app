function $qModule() {
    return {
        defer: function () {
            var deferred = jQuery.Deferred();
            deferred.promise = deferred.promise();
            return deferred;
        },
        when: jQuery.when,
        reject: function (result) {
            return this.defer().reject(result);
        },
        all: function (promises) {
            if (isArray(promises)) {
                return this.when.apply(jQuery, promises);
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
