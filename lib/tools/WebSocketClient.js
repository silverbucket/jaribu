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
    if (typeof cfg.url === 'string') {
      this.url = cfg.url;
    }
    if (typeof cfg.type === 'string') {
      this.type = cfg.type;
    }
  };
  WebSocketClient.prototype = {
    url: undefined,
    type: undefined
  };


  WebSocketClient.prototype.connect = function (onComplete) {
    var client = new WebSocket.client();

    client.on('connectFailed', function (error) {
      write('[WebSocketClient]: Connect Error: ' + error.toString());
    });

    client.on('connect', function (connection) {
      write('[WebSocketClient]: connected');
      var test = {
        command: '',
        callbacks: {
          onMessage: undefined,
          onError: undefined,
          onComplete: undefined
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
        var key;
        if (test.autoVerify === true) {
          //console.log('test.result:'+test.result);

          test.obj.assertFailAnd(test.expected, undefined, 'sendAndVerify result (second param) undefined');
          var msg = JSON.parse(message.utf8Data);
          //msg = msg.replace(/["]/g,'');

          if (message.type === 'utf8') {
            write("[WebSocketClient]: Received Response: " + message.utf8Data);

            if ((typeof test.confirmProps !== 'undefined') &&
                (!test.receivedConfirm)) {
              // confirmation expected, and not received yet. check to see if this is it
              for (key in test.confirmProps) {
                test.obj.assertAnd(test.confirmProps[key], msg[key], 'checking for property: '+key);
              }
              console.log('test.obj.result(): '+test.obj.result());
              if (test.obj.result() !== false) {
                console.log('RECEIVED CONFIRM');
                test.receivedConfirm = true;
              }
              //test.obj.result(true);
            } else if ((test.expected !== undefined) && ((test.receivedConfirm) || (typeof test.confirmProps === 'undefined'))) {
              // either confirmation received already, or not expected, continue with
              // check

              //console.log('actual response: ', message.utf8Data);
              var onComplete = false;
              if (test.callbacks.onComplete !== undefined) {
                // if onComplete was called, we dont want this assert to finish
                // the test if the match is successful, only if theres a failure.
                // which is why we use assertAnd, instead of just assert.
                onComplete = true;
              }

              if (typeof test.expected === 'string') {
                // if the test command is a string, it's probably json, lets compare it directly in that case
                if (onComplete) {
                  test.obj.assertAnd(test.expected, message.utf8Data, 'tried to compare json strings');
                } else {
                  test.obj.assert(test.expected, message.utf8Data, 'tried to compare json strings');
                }
              } else {
                //console.log('MSG: ', msg);
                //console.log('RES: ', test.result);
                if (onComplete) {
                  test.obj.assertAnd(test.expected,
                              msg, 'obj vs msg object');
                } else {
                  for (key in test.expected) {
                    test.obj.assertAnd(test.expected[key], msg[key], 'checking for property: '+key);
                  }
                  console.log('test.obj.result(): ',test.obj.assert.msg);
                  if (test.obj.result() !== false) {
                    test.obj.result(true);
                  } else {
                    test.obj.result(false, test.obj._message);
                  }
                  //console.log("HERE: ", test.obj);
                  /*test.obj.assert(test.result,
                              msg, 'obj vs msg object');*/
                }
              }

              // control flow shouldn't get this far if the callback wasn't defined
              if (onComplete) {
                test.callbacks.onComplete(msg);
              }
            } else {
              test.obj.result(false, 'WebSocketClient: no result set to auto verify');
            }
          }
        } else if (typeof test.callbacks.onMessage === 'function') {
          test.callbacks.onMessage(message);
        }
      });

      // helper function for tests to verify the command and mark test
      // complete if the verification is successful against the test
      // data passed in during the instantiation in the controller.
      connection.sendAndVerify = function (command, expected, testObj, confirmProps) {
        test.confirmProps = confirmProps;
        test.receivedConfirm = false;
        test.command = command;
        test.expected = expected;
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

      // meant to replace sendWithCallback and sendAndVerify, using a params object
      // to specify all the various details which configure the behavior of the
      // function.
      //
      // {
      //   send: JSON.stringify(data),
      //   expect: expected,
      //   testObj: test,
      //   confirmProps: confirmProps,
      //   autoVerify: true,
      //   onComplete: function() { }, // if callback function is called, verification is used with assertAnd, not assert
      //   onMessage: function() { },
      //   onError: function() { },
      // }
      connection.sendWith = function (params) {
        test.command = (params.send) ? params.send : undefined;
        test.confirmProps = (params.confirmProps) ? params.confirmProps : undefined;
        test.expected = (params.expect) ? params.expect : undefined;
        test.obj = (params.testObj) ? params.testObj : undefined;
        test.receivedConfirm = false;
        test.autoVerify = (params.autoVerify) ? true : false;
        test.callbacks.onComplete = (params.onComplete) ? params.onComplete : undefined;
        test.callbacks.onMessage= (params.onMessage) ? params.onMessage : undefined;
        test.callbacks.onError = (params.onError) ? params.onError : undefined;

        if ((test.callbacks.onMessage === undefined) && (test.autoVerify === false)) {
          write('[WebSocketClient]: neither autoVerify or onMessage were specified, no resolution can occur.');
        }
        connection.sendUTF(test.command);
      };

      onComplete(connection); // connection established, return
                              // modified connection object to test suite.
    });

    client.connect(this.url, this.type);
  };

  return WebSocketClient;
});