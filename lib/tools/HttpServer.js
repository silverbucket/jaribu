/**
 * Function: HttpServer
 *
 * The HttpServer object is used to create a very basic HTTP Server, used mainly
 * for assisting teste in verifying the functionality of it's http-suite.js
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
      app.use(express.bodyParser());
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
    }

    app.get('/', function (req, res) {
      res.send('teste');
    });

    //this.app.listen(this.app.get('port'), function () {
    //    console.log("test http server up");
    //});
    this.http.createServer(app).listen(this.port, callback());
  };

  HttpServer.prototype.stop = function () {};

  return HttpServer;
});


