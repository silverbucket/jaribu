/**
 * Function: remoteStorageMock
 *
 * a set of mock functions to mimick remoteStorage behavior from a modules
 * perspective.
 *
 * Parameters:
 *
 *   dummyData - a JSON struct of the dummy data you want to use for testing
 *
 * Returns:
 *
 *   return a remoteStorage object with sub-objects:
 *     remoteStorage.defineModule
 *     remoteStorage.baseClient
 *     remoteStorage.baseClient.use
 *     remoteStorage.baseClient.getListing
 *     remoteStorage.baseClient.getObject
 *     remoteStorage.baseClient.storeObject
 *
 *
 */
module.exports = (function(undefined) {
    var Stub = require('./Stub');
    var _ = {};
    _.data = {};

    var remoteStorage = function (dummyData) {
        if (dummyData) {
            _.data = dummyData;
        }
    };
    var defineModule = new Stub(function(name, func) {
        var ret = [];
        ret[0] = name;
        ret[1] = func;
        return ret;
    });

    var baseClient = new Stub(function(p) {
        var args = Array.prototype.slice.call(arguments);
        return args;
    });

    baseClient.use = new Stub(function() {
            return true;
    });

    function grabPathData(path) {
        var listing = false;
        var object = false;
        if ((path.match(/\/$/)) || (path.match(/^\s*$/))) {
            listing = true;
        } else {
            object = true;
        }

        var ret = [];
        for (var key in _.data) {
            if (path === key) {
                // exact match
                return _.data[key];
            } else if (listing) {
                var reg = new RegExp("^"+path+"[a-zA-Z\\-\\_0-9]+$");
                if (reg.test(key)) {
                    end_key = key.match(/[a-zA-Z\-\_0-9]+$/);
                    ret.push(end_key[0]);
                }
            }
        }
        // nothing left to do, data is set
        return ret;
    }

    // getListing calls are handle by this stub
    baseClient.getListing = new Stub(function(path, callback) {
        var d = grabPathData(path);

        if (callback) {
            callback(d);
        } else {
            return d;
        }
    });

    // getObject calls are handled by this stub
    baseClient.getObject = new Stub(function(path, callback) {
        var d = grabPathData(path);

        if (d === undefined) {
            d = [];
        }

        if (callback) {
            callback(d);
        } else {
            return d;
        }
    });

    function validateObject(obj) {
        if (_.schema  === undefined) { return true; }
        if (typeof obj !== _.schema.type) { return false; }

        for (var key in _.schema.properties) {
            if (obj[key] === undefined ) { return false; }
            if (typeof obj[key] !== _.schema.properties[key].type) { return false; }
            if ((_.schema.properties[key].required) &&
                (!obj[key])) { return false; }
        }
        return true;
    }

    // storeObject calls are handled by this stub
    baseClient.storeObject = new Stub(function(type, path, new_obj, callback) {
        if (!validateObject(new_obj)) {
            return false;
        }
        _.data[path] = new_obj;
        if (callback) {
            callback();
        }
    });

    baseClient.declareType = new Stub(function(type, schema) {
        _.schema = schema;
    });

    remoteStorage.prototype = {
        data: {},
        defineModule: defineModule,
        baseClient: baseClient
    };

    return remoteStorage;
})();
