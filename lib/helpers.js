if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
var requirements = [];
if(typeof window === 'undefined')  requirements = ['jquery']

define(requirements, function (jquery, undefined) {
  var tools = {};
  tools.jQuery = jquery;
  var runFunc = function () { this.result(true); };
   
  return {
    tools: tools,
    runFunc: runFunc
  };
});

