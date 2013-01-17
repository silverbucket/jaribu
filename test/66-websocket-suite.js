if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define([], function () {
  var suites = [];

  suites.push({
    name: "WebSocket tests",
    desc: "collection of tests to test WebSocket communication",
    setup: function (env, test) {
      env.expected = { // struct of expected results for each http call
        setupTest: { test: 'setupTest' },
        test: {
          foo: "bar"
        },
        footwear: {
          leather: "boots",
          flip: "flops",
          block: "of wood"
        },
        complex: {
          we: "are",
          using: [ "a", "complex", "data"],
          struct: [
            {
              here: "because",
              it: ['makes', 'us', {feel: "better"}, "about"]
            },
            "things"
          ]
        }
      };

      var client = new this.WebSocketClient({
        url: 'ws://localhost:9992/',
        type: 'echo-protocol'
      });
      var server = new this.WebSocketServer({
        port: 9992,
        messages: env.expected
      });

      var _this = this;
      server.run(function () {
        _this.write('websocket dummy server running');
        // setup client
        client.connect(function (connection) {
          env.connection = connection;
          env.connection.sendAndVerify('setupTest', env.expected.setupTest, test);
        });
      });
    },
    tests: [
      {
        desc: "first test",
        run: function (env, test) {
          this.assertAnd(env.connection.connected, true);
          env.connection.sendAndVerify('test', env.expected['test'], test);
        }
      },
      {
        desc: "complex data struct",
        run: function (env, test) {
          env.connection.sendAndVerify('complex', env.expected['complex'], test);
        }
      },
      {
        desc: "with callback",
        run: function (env, test) {
          env.connection.sendWithCallback('footwear', function (data) {
            test.assert(data.utf8Data,
                   JSON.stringify(env.expected['footwear']));
          });
        }
      },
      {
        desc: 'lets try to fail! how exciting!',
        willFail: true,
        run: function (env, test) {
          env.connection.sendAndVerify('dontexist', 'lalaa', test);
        }
      }
    ]
  });

  return suites;
});