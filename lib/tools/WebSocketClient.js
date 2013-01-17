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
 *   returns a WebSocketClient object a connect() function, sendAndVerify(),
 *   and sendWithCallback()
 */
if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(['jquery', 'websocket', './Write'],
       function (jquery, WebSocket, Write, undefined) {
  var writeObj = new Write();
  var write = writeObj.func;

  var WebSocketClient = function (cfg) {
    if (typeof cfg.url == 'string') {
      this.url = cfg.url;
    }
    if (typeof cfg.type == 'string') {
      this.type = cfg.type;
    }
  };
  WebSocketClient.prototype = {
    url: undefined,
    type: undefined
  };


  WebSocketClient.prototype.connect = function (onComplete) {
    var client = new WebSocket.client();
    var _this = this;

    client.on('connectFailed', function (error) {
      write('[WebSocketClient]: Connect Error: ' + error.toString());
    });

    client.on('connect', function (connection) {
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

      connection.on('error', function (error) {
        write("[WebSocketClient]: Connection Error: " + error.toString());
      });

      connection.on('close', function () {
        write('[WebSocketClient]: Connection Closed');
      });

      connection.on('message', function (message) {
        if (test.autoVerify === true) {
          console.log('test.result:'+test.result);
          test.obj.assertFailAnd(test.result, undefined, 'sendAndVerify result (second param) undefined');
          var msg = JSON.parse(message.utf8Data);
          //msg = msg.replace(/["]/g,'');
          //test.obj.assert(msg, _this.messages[test.command]);

          if (message.type === 'utf8') {
            write("[WebSocketClient]: Received Response: " + msg);

            if (test.result !== undefined) {
              //console.log('expected response: ', _this.messages[test.command]);
              //console.log('actual response: ', message.utf8Data);
              if (typeof test.result === 'string') {
                // if the test command is a string, it's probably json, lets compare it directly in that case
                test.obj.assert(test.result, message.utf8Data, 'tried to compare json strings');
              } else {
                test.obj.assert(test.result,
                              msg, 'stringified JSON vs msg object');
              }
            } else {
              test.obj.result(false, 'WebSocketClient: no result set to auto verify');
            }
          }
        } else {
          test.callbacks.onMessage(message);
        }
      });

      // helper function for tests to verify the command and mark test
      // complete if the verification is successful against the test
      // data passed in during the instantiation in the controller.
      connection.sendAndVerify = function (command, result, testObj) {
        test.command = command;
        test.result = result;
        test.autoVerify = true;
        test.obj = testObj;
        connection.sendUTF(command);
      };
      // another helper function to assist with an async test that doesn't
      // want to use auto-verify. You can do your verification in the
      // callback methods you specify
      connection.sendWithCallback = function (command, onMessage, onError) {
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