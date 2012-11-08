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
define([], function(undefined) {

    var HttpServer = function(cfg) {
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
        app: undefined
    };

    HttpServer.prototype.run = function() {
        var express = requirejs('express');
        this.app = express();
        this.app.configure(function() {
            this.app.set('port', this.port);
        });
        for (var key in this.uris) {
            this.app.get(key, function(req, res) {
                res.send(this.uris[key]);
            });
        }
        this.app.listen(app.get('port'), function () {
            console.log("test http server listening on port " + app.get('port'));
        });
    };

    HttpServer.prototype.stop = function() {
        this.app.stop();
    };

    return HttpServer;
});


