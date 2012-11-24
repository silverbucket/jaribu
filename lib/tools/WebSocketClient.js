/**
 * Function: WebSocketClient
 *
 * The WebSocketClient object is used to create an object for simplifying
 * WebSocketClient requests.
 *
 *      env.WebSocketClient = new this.WebSocketClient();
 *      env.WebSocketClient.connect('ws://localhost:9992/',
 *                     'echo-protocol',
 *                      function(connection) {
 *           env.connection = connection;
 *           env.connection.send('command', _this);
 *      });
 *
 * Parameters:
 *
 *   baseUrl - the baseUrl of all your WebSocketClient calls
 *
 * Returns:
 *
 *   returns a WebSocketClient object with get() and post() methods that take URIs (relative
 *   to baseUrl) to call.
 */
if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(['jquery', 'websocket', './Write'], function(jquery, WebSocket, Write, undefined) {
  var writeObj = new Write();
  var write = writeObj.func;

  var WebSocketClient = function(cfg) {
    if (typeof cfg.url == 'string') {
      this.url = cfg.url;
    }
    if (typeof cfg.messages === 'object') {
      this.messages = cfg.messages;
    }
    if (typeof cfg.type == 'string') {
      this.type = cfg.type;
    }
  };
  WebSocketClient.prototype = {
    url: undefined,
    type: undefined,
    messages: {}
  };


  WebSocketClient.prototype.connect = function(onComplete) {
    var client = new WebSocket.client();
    var _this = this;

    client.on('connectFailed', function(error) {
      write('[WebSocketClient]: Connect Error: ' + error.toString());
    });

    client.on('connect', function(connection) {
      write('[WebSocketClient]: connected');
      var test = {
        command: '',
        callbacks: {
          onMessage: undefined,
          onError: undefined
        },
        obj: undefined,
        autoVerify: false
      }; // ASYNC ?

      connection.on('error', function(error) {
        write("[WebSocketClient]: Connection Error: " + error.toString());
      });

      connection.on('close', function() {
        write('[WebSocketClient]: Connection Closed');
      });

      connection.on('message', function(message) {
        if (test.autoVerify === true) {
          test.obj.assertFailAnd(_this.messages[test.command], undefined);
          test.obj.assert(message.utf8Data, _this.messages[message.utf8Data]);

          if (message.type === 'utf8') {
            write("[WebSocketClient]: Received Response: " + message.utf8Data);

            if (_this.messages[test.command] !== undefined) {
              //console.log('expedted response: ', _this.messages[test.command]);
              //console.log('actual response: ', message.utf8Data);
              test.obj.assert(JSON.stringify(_this.messages[test.command]), message.utf8Data);
            } else {
              test.obj.result(false, 'data for ' + test.command + ' does not exist');
            }
          }
        } else {
          test.callbacks.onMessage(message);
        }
      });

      // helper function for tests to verify the command and mark test
      // complete if the verification is successful against the test
      // data passed in during the instantiation in the controller.
      connection.sendAndVerify = function(command, testObj) {
        test.command = command;
        test.autoVerify = true;
        test.obj = testObj;
        connection.sendUTF(command);
      };
      // another helper function to assist with an async test that doesn't
      // want to use auto-verify. You can do your verification in the
      // callback methods you specify
      connection.sendWithCallback = function(command, onMessage, onError) {
        test.command = command;
        test.autoVerify = false;
        test.callbacks.onMessage= onMessage;
        test.callbacks.onError = onError;
        connection.sendUTF(command);
      };

      onComplete(connection); // connection established, return
                              // modified connection object to test suite.
    });

    client.connect(this.url, this.type);
  };

  return WebSocketClient;
});