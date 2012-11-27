if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define([], function () {
  var suites = [];

  suites.push({
    name: "HTTP / REST tests",
    desc: "collection of tests to test HTTP calls",
    setup: function (env) {
      this.assertAnd(this._message, '');
      env.expected = { // struct of expected results for each http call
        test: {
          foo: "bar"
        }
      };
      env.server = new this.HttpServer({
        port: 9991,
        uris: env.expected
      });
      var _this = this;
      env.server.run(function () {
        _this.write('http dummy server running');

        env.http = new _this.Http({
          baseUrl: 'http://localhost:9991'
        });

        env.http.get('/', {
          success: function (data, textStatus, jqXHR) {
            _this.assert(data, 'teste');
          },
          error: function () {
            _this.result(false, 'failed http request on /');
          }
        });
      });
    },
    takedown: function (env) {
      //env.server.stop();
      this.result(true);
    },
    tests: [
      {
        desc: "same call as in setup, from test",
        run: function (env) {
          var _this = this;
          env.http.get('/', {
            success: function (r) {
              console.log(r);
              _this.assert(r, 'teste');
            },
            error: function (r) {
              _this.result(false, 'failed http request on /');
            }
          });

        }
      },
      {
        desc: "get /test",
        run: function (env) {
          var _this = this;
          env.http.get('/test', {
            success: function (data) {
              _this.assert(data, {foo:'bar'});
            },
            error: function () {
              _this.result(false, 'failed get /test');
            }
          });
        }
      },
      {
        desc: "post /test",
        run: function (env) {
          var _this = this;
          env.http.post('/test', {foo:"baz"}, {
            success: function (data) {
              _this.assert(data, 'POST /test');
            },
            error: function () {
              _this.result(false, 'failed post /test');
            }
          });
        }
      },
      {
        desc: "get /test with new data",
        run: function (env) {
          var _this = this;
          env.http.get('/test', {
            success: function (data) {
              _this.assert(data, {foo:'baz'});
            },
            error: function () {
              _this.result(false, 'failed get /test');
            }
          });
        }
      }
    ]
  });

  return suites;
});