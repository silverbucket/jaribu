var test_module = remoteStorage.defineModule('tests', function(privateClient, publicClient) {
  //"use strict";
  var moduleName = 'tests';
  privateClient.use('');
  publicClient.use('');

  return {
    name: moduleName,

    dataHints: {
      "module" : "A test module"
    },


    exports: {

      // remoteStorage.bookmarks.on('change', function(changeEvent) {
      //   if(changeEvent.newValue && changeEvent.oldValue) {
      //    changeEvent.origin:
      //      * window - event come from current window
      //            -> ignore it
      //      * device - same device, other tab (/window/...)
      //      * remote - not related to this app's instance, some other app updated something on remoteStorage
      //   }
      // });
      on: privateClient.on,


      getIds: function(callback) {
        return privateClient.getListing('', callback);
      },

      get: function(id, callback) {
        return privateClient.getObject(id, callback);
      },

      add: function(details, id) {
        if (!id) {
          id = privateClient.getUuid();
        }
        var status = privateClient.storeObject('test', id, details);
        return id;
      },

      remove: function(id) {
        privateClient.remove(id);
      }
    }
  };
});
if(!module) var module={};
module.exports = test_module;