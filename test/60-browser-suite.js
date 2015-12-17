if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define([], function () {
  var suites = [];

  suites.push({
    name: "jaribu browser only",
    desc: "these tests should only be running in the browser",
    runInConsole: false,
    tests: [
      {
        desc: "check for window object",
        run: function (env, test) {
          test.assertType(module.exports, 'undefined');
          test.assertType(window, 'object');
        }
      }
    ]
  });

  return suites;
});
