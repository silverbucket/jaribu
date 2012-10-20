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

    // getListing calls are handle by this stub
    baseClient.getListing = new Stub(function(path) {
        if (path.match(/^$/) !== -1) {
            // return list of records ids
            var num_records = _.data.length;
            var ret = [];
            for (var key in _.data) {
                ret.push(key);
            }
            return ret;
        }
        return false;
    });

    // getObject calls are handled by this stub
    baseClient.getObject = new Stub(function(path) {
        var d = false;
        var p = path.match(/^([a-z\-0-9]+)$/);
        
        if (!_.data[p[1]]) {
            return [];
        }

        d = _.data[p[1]];
        return d;
    });
    remoteStorage.prototype = {
        data: {},
        defineModule: defineModule,
        baseClient: baseClient
    };
    
    // storeObject calls are handled by this stub
    baseClient.storeObject = new Stub(function(type, path, obj) {
        var p;
        var d = false;
        if (path.match(/^[a-z\-0-9]+$/)) {
            p = path.match(/^([a-z\-0-9]+)$/);
        } else {
            return false;
        }

        if (!_.data[p[1]]) {
            // this recordID does not exist, create it
            _.data[p[1]] = [];
        }

        var tmp = _.data[p[1]];
        _.data[p[1]] = obj;
    });

    return remoteStorage;
})();
