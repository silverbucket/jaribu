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
          baseUrl: 'http://127.0.0.1:9991'
        });

        env.http.get('/', {
          success: function (data, textStatus, jqXHR) {
            _this.assert(data, 'jaribu');
          },
          error: function (xhr, type, err) {
            _this.result(false, 'failed http request on / : ['+type+'] ' + err);
          }
        });
      });
    },
    takedown: function (env) {
      env.server.stop();
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
              _this.assert(r, 'jaribu');
            },
            error: function (r) {
              _this.result(false, 'failed http request on /');
            }
          });

        }
      },
      {
        desc: "GET /testBAD",
        run: function (env) {
          var _this = this;
          env.http.get('/testBAD', {
            success: function (data, textStatus, req) {
              _this.result(false, 'shouldn\'t succeed in fetching a bad URL');
            },
            error: function (req, textStatus, errorThrown) {
              _this.assertAnd(404, req.status);
              _this.result(true, 'failed get /testBAD');
            }
          });
        }
      },
      {
        desc: "GET /test",
        run: function (env) {
          var _this = this;
          env.http.get('/test', {
            success: function (data, textStatus, req) {
              _this.assertAnd(200, req.status);
              _this.assert(data, {foo:'bar'});
            },
            error: function (req, textStatus, errorThrown) {
              _this.result(false, 'failed get /test');
            }
          });
        }
      },
      {
        desc: "POST /test",
        run: function (env) {
          var _this = this;
          env.http.post('/test', {foo:"baz"}, {
            success: function (data, textStatus, req) {
              _this.assert(data, 'POST /test');
            },
            error: function (req, textStatus, errorThrown) {
              _this.result(false, 'failed post /test');
            }
          });
        }
      },
      {
        desc: "GET /test with new data",
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
      },
      {
        desc: "DEL /test",
        run: function (env) {
          var _this = this;
          env.http.del('/test', {
            success: function (data) {
              _this.assert(data, 'DEL /test');
            },
            error: function () {
              _this.result(false, 'failed DEL /test');
            }
          });
        }
      },
      {
        desc: "PUT /test",
        run: function (env) {
          var _this = this;
          env.http.put('/test', {
            success: function (data) {
              _this.assert(data, 'PUT /test');
            },
            error: function () {
              _this.result(false, 'failed PUT /test');
            }
          });
        }
      }
    ]
  });

  return suites;
});