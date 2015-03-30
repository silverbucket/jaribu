if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

var _fetch = 'fetch';
if (typeof window === 'undefined') {
  _fetch = 'node-fetch';
}

define([ _fetch, 'bluebird' ], function (fetch, bluebird, undefined) {
  var tools = {};
  tools.fetch = fetch;

  if (typeof Promise === 'undefined') {
    tools.fetch.Promise = bluebird;
  }

  var runFunc = function () { this.result(true); };
  var runFail = function (err) {
    if (err) {
      this.result(false, err);
    } else {
      this.result(false);
    }
  };

  return {
    tools: tools,
    runFunc: runFunc,
    runFail: runFail
  };
});

