if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(['./helpers', './tools/Write'],
function (helpers, Write, undefined) {

  /*
   * The Test object is the 'root' object of each test. The test object
   * contains Scaffolding objects for each of it's test: setup, takedown,
   * actual (actual is the actual test).
   *
   * Assignment of Scaffolding objects to it's properties are handled
   * later in this function.
   */
  write = new Write();
  function Test() {}
  Test.prototype = {
    constructor: Test,
    type: "Test",
    name: "",
    desc: "",
    tools: helpers.tools,
    write: write.func,
    setup: undefined,
    takedown: undefined,
    actual: undefined,
    next: undefined,
    prev: undefined,
    parent: undefined, // link to the tests suite object
    position: null
  };


  return Test;
});