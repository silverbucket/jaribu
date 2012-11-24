if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define([], function() {
var suites = [];

suites.push({
  name: "WebSocket tests",
  desc: "collection of tests to test WebSocket communication",
  setup: function(env) {
    env.expected = { // struct of expected results for each http call
      setupTest: 'setupTest',
      test: {
        foo: "bar"
      },
      footwear: {
        leather: "boots",
        flip: "flops",
        block: "of wood"
      }
    };

    var client = new this.WebSocketClient({
      url: 'ws://localhost:9992/',
      type: 'echo-protocol',
      messages: env.expected // used for auto verification (if specified
                   // by using the sendAndVerify() method in the
                   // test).
    });
    var server = new this.WebSocketServer({
      port: 9992,
      messages: env.expected
    });

    var _this = this;
    server.run(function() {
      _this.write('websocket dummy server running');
      // setup client
      client.connect(function(connection) {
        env.connection = connection;
        env.connection.sendAndVerify('setupTest', _this);
      });
    });
  },
  tests: [
    {
      desc: "first test",
      run: function(env) {
        this.assertAnd(env.connection.connected, true);
        env.connection.sendAndVerify('test', this);
      }
    },
    {
      desc: "complex data struct",
      run: function(env) {
        env.connection.sendAndVerify('complex', this);
      }
    },
    {
      desc: "with callback",
      run: function(env) {
        var _this = this;
        env.connection.sendWithCallback('footwear', function(data) {
          _this.assert(data.utf8Data,
                 JSON.stringify(env.expected['footwear']));
        });
      }
    }
  ]
});

return suites;
});