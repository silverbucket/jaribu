/**
 * Function: Http
 *
 * The Http object is used to create an object for simplifying http requests and
 * testing REST interfaces. It has public methods like get() and post().
 *
 *      env.http = new this.Http({
 *          baseUrl: 'http://localhost:9991'
 *      });
 *
 * Parameters:
 *
 *   baseUrl - the baseUrl of all your HTTP calls
 *
 * Returns:
 *
 *   returns a Http object with get() and post() methods that take URIs (relative
 *   to baseUrl) to call.
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(['jquery'], function(jquery, undefined) {
    var Http = function(cfg) {
        if (typeof cfg.baseUrl == 'string') {
            this.baseUrl = cfg.baseUrl;
        }
    };
    Http.prototype = {
        baseUrl: undefined
    };
    Http.prototype.get = function(uri, cfg) { //params, success, failure) {
        jquery.ajax(this.baseUrl+uri, cfg);
    };

    return Http;
});
