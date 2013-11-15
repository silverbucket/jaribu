if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(['jquery'],
function (jquery, undefined) {

  var tools = {};
  tools.jQuery = jquery;
  var runFunc = function () { this.result(true); };

  return {
    tools: tools,
    runFunc: runFunc
  };
});