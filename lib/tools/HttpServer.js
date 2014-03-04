/**
 * Function: HttpServer
 *
 * The HttpServer object is used to create a very basic HTTP Server, used mainly
 * for assisting jaribu in verifying the functionality of it's http-suite.js
 *
 *      env.expected = { // struct of expected results for each http call
 *         test: {
 *            foo: "bar"
 *          }
 *      };
 *
 *      env.server = new this.HttpServer({
 *          port: 9991,
 *          uris: env.expected
 *      });
 *      this.assertAnd(env.server.run(), true);
 *
 * Parameters:
 *
 *   object conatining the properties:
 *       port - port to run on
 *
 *       uris - an object where the first set of properties are URIs the values
 *              attached to them are the data sets to return.
 *
 * Returns:
 *
 *   returns output from the function passed as parameter
 */
if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define([], function (undefined) {

  var HttpServer = function (cfg) {
    if (typeof cfg.port === 'number') {
      this.port = cfg.port;
    }
    if (typeof cfg.uris === 'object') {
      this.uris = cfg.uris;
    }
  };

  HttpServer.prototype = {
    port: 9500,
    uris: {},
    http: undefined
  };

  HttpServer.prototype.run = function (callback) {
    var key;
    var express = requirejs('express');

    this.http = requirejs('http');
    var app = express();

    app.configure(function () {
      app.set('port', this.port);
      app.use(express.urlencoded());
      app.use(express.json());
      app.use(app.router);
    });

    var _this = this;
    for (key in this.uris) {
      app.get('/'+key, function (req, res) {
        res.send(_this.uris[key]);
      });
      app.post('/'+key, function (req, res) {
        _this.uris[key] = req.body;
        res.send('POST /'+key);
      });
      app.del('/'+key, function (req, res) {
        _this.uris[key] = req.body;
        res.send('DEL /'+key);
      });
      app.put('/'+key, function (req, res) {
        _this.uris[key] = req.body;
        res.send('PUT /'+key);
      });
    }

    app.get('/', function (req, res) {
      res.send('jaribu');
    });

    this.server = this.http.createServer(app);
    this.server.listen(this.port, '127.0.0.1', function () {
      console.log('listening at: ',_this.server.address());
      callback();
    });
  };

  HttpServer.prototype.stop = function () {
    this.server.close();
  };

  return HttpServer;
});


