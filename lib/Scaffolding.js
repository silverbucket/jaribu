if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define([
  './helpers', './tools/Write', './tools/result',
  './tools/assert', './tools/assertType', './tools/Env',
  './fakes/Stub', './fakes/remoteStorageMock',
  './tools/Http', './tools/HttpServer',
 './tools/WebSocketClient', './tools/WebSocketServer'],
function (helpers, Write, result, assert, assertType, Env,
          Stub, remoteStorageMock, Http, HttpServer,
          WebSocketClient, WebSocketServer, undefined) {

  /*
   * class definitions for suites, tests, and scaffolding
   */
  Stub.mock = {};
  Stub.mock.remoteStorage = remoteStorageMock;

  /*
   * The Scaffolding objects contain all of the functions and
   * properties available to any test (not just the 'run' test but
   * also the setup, takedown, afterEach and beforeEach tests).
   */
  var write = new Write();
  function Scaffolding() {
    // bind all methods, so they can be used as callbacks
    for(var key in this) {
      if(typeof(this[key]) === 'function' && ! key.match(/^[A-Z]/)) {
        this[key] = this[key].bind(this);
      }
    }
  }
  Scaffolding.prototype = {
    constructor: Scaffolding,
    type: "Scaffolding",
    tools: helpers.tools,
    write: write.func,
    _written: false,
    status: undefined,
    assert: assert.assertHandler,
    assertFail: assert.assertFailHandler,
    assertAnd: assert.assertAndHandler,
    assertFailAnd: assert.assertFailAndHandler,
    assertType: assertType.assertTypeHandler,
    assertTypeFail: assertType.assertTypeFailHandler,
    assertTypeAnd: assertType.assertTypeAndHandler,
    assertTypeFailAnd: assertType.assertTypeFailAndHandler,
    _assert: assert.assert,
    _assertType: assertType.assertType,
    Stub: Stub,
    Http: Http,
    HttpServer: HttpServer,
    WebSocketServer: WebSocketServer,
    WebSocketClient: WebSocketClient,
    timeout: 10000,
    env: undefined,
    run: helpers.runFunc,
    _result: undefined,
    _message: '',  // messages coming from the test tools
    _stackTrace: undefined,  // optional stack trace added by run()
    failmsg: '',  // the failure message, used later for summarys
    result: result,
    done: helpers.runFunc //function() { this.result(true); }
  };

  return Scaffolding;
});