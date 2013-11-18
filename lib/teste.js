if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define([
  'util', './colors', './display', './tools/Env',
  './Scaffolding', './Test', './Suite'],
function (sys, c, display, Env, Scaffolding, Test, Suite, undefined) {
  "use strict";
  var suites = [];
  var err_msg = {};
  var pub = {};
  var _ = {};
  _.onComplete = function () {};


  function buildTestObj(env, s, t) {
    if (! t.desc ) {
      err_msg = s.name + ": test '" + t.name +
              "'' requires a 'desc' property";
      return false;
    } else if (typeof t.run !== 'function') {
      err_msg = s.name + ": test '" + t.name +
              "'' requires a 'run' function";
      return false;
    }

    var test = new Test();
    //test.name = t.name;
    test.desc = t.desc;
    test.setup = new Scaffolding();
    test.actual = new Scaffolding();
    test.takedown = new Scaffolding();

    // even though before/afterEach are defined
    // at the suite level, we need a separate object
    // for each test to run so that it's environment
    // is preserved and there's no bleed.
    test.beforeEach = new Scaffolding();
    test.afterEach = new Scaffolding();
    test.beforeEach.env = env;
    test.afterEach.env = env;
    if (typeof s.beforeEach === 'function') {
      test.beforeEach.run = s.beforeEach;
    }
    if (typeof s.afterEach === 'function') {
      test.afterEach.run = s.afterEach;
    }

    test.setup.env = env;
    test.actual.env = env;
    test.takedown.env = env;
    test.actual.run = t.run;
    test.actual.willFail = undefined;
    if (typeof t.setup === 'function') {
      test.setup.run = t.setup;
    }
    if (typeof t.takedown === 'function') {
      test.takedown.run = t.takedown;
    }
    // figureout if there is a timeout to override default
    if (typeof t.timeout === 'number') {
      test.actual.timeout = t.timeout;
      test.setup.timeout = t.timeout;
      test.takedown.timeout = t.timeout;
    }
    if (typeof t.willFail === 'boolean') {
      // if true, a failing test passes, and passing test fails
      test.actual.willFail = t.willFail;
    }

    //console.log(test);
    return test;
  }

  /**
   * load a single suite json object into the library
   *
   * @param  {object}   s   suite object from test file
   * @return {boolean}      success of loading
   */
  pub.loadSuite = function (s) {
    if (! s.desc ) {
      err_msg = "suite requires a 'desc' property";
      return false;
    } else if (! s.tests ) {
      err_msg = "suite requires a 'tests' array";
      return false;
    }
    var i;

    /*
     * Create all the test objects from the JSON data
     */
    var tests = [];
    var suite = new Suite(); // we define this early so we can assign it
                             // as parent to test objects
    var env = new Env();
    if (typeof s.timeout === 'number') {
      Test.prototype.timeout = s.timeout; // override test timeouts with
                                          // Suite timeout
      Scaffolding.prototype.timeout = s.timeout; // override test
                                                 // timeouts with Suite
                                                 // timeout
    }

    var num_tests = s.tests.length;
    for (i = 0; i < num_tests; i += 1) {
      var test = buildTestObj(env, s, s.tests[i]);

      // set position related attributes to test object
      test.position = i;
      if (i !== 0) {
        test.prev = tests[i - 1];
        tests[i - 1].next = test;
      }
      test.parent = suite;
      tests.push(test);
    }

    /*
     * Create the suite object
     */
    suite.name = s.name;
    suite.desc = s.desc;
    suite.setup = new Scaffolding();
    suite.takedown = new Scaffolding();
    suite.setup.env = env;
    suite.takedown.env = env;
    if (typeof s.setup === 'function') {
      suite.setup.run = s.setup;
    }
    if (typeof s.takedown === 'function') {
      suite.takedown.run = s.takedown;
    }
    if (typeof s.abortOnFail === 'boolean') {
      // if true, abort execution
      suite.abortOnFail = s.abortOnFail;
    }

    suite.tests = tests;
    // set position related attributes to suite object
    var num_suites = suites.length;
    suite.position = num_suites;
    if (num_suites !== 0) {
      suite.prev = suites[num_suites - 1];
      suites[num_suites - 1].next = suite;
    }
    suites.push(suite);
    return true;
  };


  /**
   * returns the error message
   * @return {string} error message
   */
  pub.getErrorMessage = function () {
    return err_msg;
  };


  /**
   * returns the number of suites loaded
   * @return {number} number of suites loaded
   */
  pub.getNumSuites = function () {
    return suites.length;
  };


  /**
   * returns the total number of tests in all the suites combined.
   * @return {number} total number of tests
   */
  pub.getNumTests = function () {
    var total_tests = 0, i = 0;
    var num_suites = pub.getNumSuites();
    for (i = 0; i < num_suites; i += 1) {
      total_tests = total_tests + suites[i].tests.length;
    }
    return total_tests;
  };


  /**
   * begins the test cyle, by activating the first suite
   * @param  {function} onComplete    function to call when all tests are
   *                                  complete
   * @return {}
   */
  pub.begin = function (onComplete) {
    _.onComplete = onComplete;
    process.on('uncaughtException', function(error) {
     if(typeof(_.current) === 'object') {
       _.current.result(false, "\n" + error, error.stack);
     } else {
       console.error("Uncaught exception without test context: ", "\n" + error, error.stack);
       process.exit(-1);
     }
   });
    var num_suites = pub.getNumSuites();
    var total_tests = pub.getNumTests();
    display.begin(num_suites, total_tests);
    if (suites[0]) {
      run(suites[0], 'setup');
    }
  };


  /**
   * test object is passed here when it passes the test, setup or takedown.
   * handles printing the result, and updating the objects status.
   *
   * @param  {object} o    test object
   * @param  {string} type indicates the type of action just run
   * @return {}
   */
  var pass = function (o, type) {
    display.pass(o, type);

    if (o.type === 'Suite') {  // Suite ----------------------------
      if (type === 'setup') {  // setup completed
        o.setup.status = true;
        // run the next test in suite
        var testIndex = o.testIndex;
        if (typeof o.tests[testIndex] === 'object') {
          o.testIndex = o.testIndex + 1;
          run(o.tests[testIndex], 'beforeEach');
        } else {
          run(o, 'takedown');
        }
      } else if (type === 'takedown') {  // takedown completed
        o.takedown.status = true;
        if (o.next) {
          // move on to the next suite
          run(o.next, 'setup');
        } else {
          // finished, show summary results
          showSummary();
        }
      }
    } else {  // Test ----------------------------------------------

      if (type === 'beforeEach') {  // beforeEach completed
        o.beforeEach.status = true;
        // run the test setup
        run(o, 'setup');
      } else if (type === 'setup') {  // setup completed
        o.setup.status = true;
        // run the test
        run(o, 'actual');
      } else if (type === 'takedown') {  // takedown completed
        o.takedown.status = true;
        // call afterEach
        run(o, 'afterEach');
      } else if (type === 'afterEach') {  // afterEach completed
        o.afterEach.status = true;
        if (typeof o.parent.tests[o.parent.testIndex] === 'object') {
          var ti = o.parent.testIndex;
          o.parent.testIndex = o.parent.testIndex + 1;
          run(o.parent.tests[ti], 'beforeEach');
        } else {
          // run suites takedown
          run(o.parent, 'takedown');
        }
      } else {
        // test is complete
        o.status = true;
        run(o, 'takedown');
      }
    }
  };


  /**
   * test object is passed here when it fails the test, setup or takedown.
   * handles printing the result, and updating the objects status.
   *
   * @param  {object} o    test object
   * @param  {string} type indicates the type of action just run
   * @param  {string} msg  any special message to pass on when printing result
   * @return {}
   */
  var fail = function (o, type, msg) {
    if (msg) {
      o[type].failmsg = msg;
    }

    display.fail(o, type);

    // if we've failed, we always perform the takedown.
    if (type === 'takedown') {
      // takedown has been done
      o.takedown.status = false;
      if (o.name === 'Test') {
        // run afterEach for this test
        run(o, 'afterEach');
      } else {
        // run next suite
        run(o.next, 'setup');
      }
    } else if (type === 'afterEach') {
      o.afterEach.status = false;

      if (typeof o.parent.tests[o.parent.testIndex] === 'object') {
        var ti = o.parent.testIndex;
        o.parent.testIndex = o.parent.testIndex + 1;
        run(o.parent.tests[ti], 'beforeEach');
      } else {
        // run suites takedown
        run(o.parent, 'takedown');
      }
    } else if (type === 'beforeEach') {
      o.beforeEach.status = false;
      run(o, 'afterEach');
    } else if (type === 'setup') {
      o.setup.status = false;
      run(o, 'takedown');
    } else if (type === 'actual') {
      // the actual test
      o.status = false;
      if (o.parent.abortOnFail) {
        throw('test failed with abortOnFail set... aborting.');
      }
      run(o, 'takedown');
    } else {
      throw('no type specified in run()');
    }
  };


  /**
   * generically handles each aspect of a suite/test setup/run/takedown
   * using the commonalities in each of the objects methods, and the
   * chaining references (o.next).
   *
   * @param  {object} o    test or suite object
   * @param  {string} type the type of task to be performed, if undefined
   *                       assumes test
   */
  var run = function (o, type) {
    var local;
    if ( type === 'setup' ) {
      if (o.type === 'Suite') {
        display.suiteBorder();
        display.details('suite', o);
        display.setup('suite');
      } else {
        display.linebreak();
        display.details('test', o);
        display.setup('test');
      }
      local = o.setup;
    } else if ( type === 'beforeEach' ) {
      display.beforeEach();
      local = o.beforeEach;
    } else if ( type === 'afterEach' ) {
      display.afterEach();
      local = o.afterEach;
    } else if ( type === 'takedown' ) {
      if (o.type === 'Suite') {
        display.takedown('suite');
      } else {
        display.takedown('test');
      }
      local = o.takedown;
    } else {
      // must be a test
      local = o.actual;
    }

    // save reference to current test, so the 'uncaughtException' handler can fail
    // the right test.
    _.current = local;

    executeTest(o, type, local);
  };


  var executeTest = function (o, type, local) {
    try {
      var ret = local.run(local.env.get(), local);
      if (ret && typeof(ret.then) === 'function') {
        ret.then(
          function () {
            local.result(true, 'promise fulfilled');
          },
          function () {
            local.result(false, 'promise failed ' + JSON.stringify(arguments));
          }
        );
      }

      // if the promise library has a fail function, we can catch unexpected errors
      if (ret && typeof(ret.fail) === 'function') {
        ret.fail(function () {
          local.result(false, 'promise failed with an error ' + JSON.stringify(arguments));
        });
      }
    } catch (err) {
      //console.log('LOCAL: ',local);
      if (err.hasOwnProperty('stack')) {
        local.result(false, "\n"+err, err.stack);
      } else {
        local.result(false, "\n"+err);
      }
    }

    var waitCount = 0;
    var waitInterval = 50;
    // this is function calls itself after a set interval, checking the
    // status of the test via. the result property.
    // result is initialized as undefined, and the test is not complete
    // until it is 'true' or 'false'.
    (function waitResult() {
      if (local.result() === undefined)  {
        if (waitCount < local.timeout) {
          waitCount = waitCount + waitInterval;
          setTimeout(waitResult, waitInterval);
        } else {
          if (local.willFail === true) {
            display.print("this test failed, but that's OK because"+
                    " it's supposed to");
            pass(o, type);
          } else {
            fail(o, type, 'timeout');
          }
        }
      } else if (local.result() === false) {
        if (local.willFail === true) {
          display.print("this test failed, but that's OK because"+
                  " it's supposed to");
          pass(o, type);
        } else {
          fail(o, type);
        }
      } else if (local.result() === true) {
        if ((typeof local.willFail === 'boolean') &&
            (local.willFail === true)) {
          display.print("this test passed, but that's " + c.red +
                  'NOT OK' + c.reset +
                  " because it's supposed to fail.");
          fail(o, type);
        } else {
          pass(o, type);
        }
      } else {
        display.print(c.red + "ERROR GETTING RESULT" + c.reset);
        fail(o, type);
      }
    }());
  };


  var getSummary = function () {
    var summary = {
      'scaffolding': {
        'total': 0,
        'failed': 0,
        'passed': 0,
        'skipped': 0,
        'failObjs': []
      },
      'tests': {
        'total': 0,
        'failed': 0,
        'passed': 0,
        'skipped': 0,
        'failObjs': []
      }
    };

    var num_suites = pub.getNumSuites();
    var i = 0, n = 0, z = 0;
    var types, lenTypes;
    for (i = 0; i < num_suites; i += 1) {
      var s = suites[i];

      summary.scaffolding.total = summary.scaffolding.total + 2;

      // suite setup & takedown
      types = ['setup', 'takedown'];
      for (z = 0, lenTypes = types.length; z < lenTypes; z = z + 1) {
        if (typeof s[types[z]].status === 'undefined') {
          summary.scaffolding.skipped = summary.scaffolding.skipped + 1;
        } else if (!s[types[z]].status) {
          summary.scaffolding.failed = summary.scaffolding.failed + 1;
          summary.scaffolding.failObjs.push({name: 'suite',
                             type: types[z],
                             'obj': s});
        } else {
          summary.scaffolding.passed = summary.scaffolding.passed + 1;
        }
      }

      // tests
      var num_tests = suites[i].tests.length;
      for (n = 0; n < num_tests; n++) {
        var t = suites[i].tests[n];
        summary.scaffolding.total = summary.scaffolding.total + 2;

        types = ['setup', 'takedown', 'beforeEach', 'afterEach'];
        for (z = 0, lenTypes = types.length; z < lenTypes; z = z + 1) {
          if (typeof t[types[z]].status === 'undefined') {
            summary.scaffolding.skipped =
                        summary.scaffolding.skipped + 1;
          } else if (!t[types[z]].status) {
            summary.scaffolding.failed = summary.scaffolding.failed + 1;
            summary.scaffolding.failObjs.push({name: 'test',
                               type: types[z],
                               'obj': t});
          } else {
            summary.scaffolding.passed = summary.scaffolding.passed + 1;
          }
        }

        summary.tests.total = summary.tests.total + 1;
        if (typeof t.status === 'undefined') {
          summary.tests.skipped = summary.tests.skipped + 1;
        } else if (!t.status) {
          summary.tests.failed = summary.tests.failed + 1;
          summary.tests.failObjs.push({name: 'test',
                         type: 'actual',
                         'obj': t});
        } else {
          summary.tests.passed = summary.tests.passed + 1;
        }
      }
    }
    return summary;
  };

  var showSummary = function () {
    var num_suites = pub.getNumSuites();
    var summary = getSummary();

    display.summary(num_suites, summary);

    display.failures(summary);

    // call specified onComplete function
    _.onComplete();

    if (((summary.tests.failed > 0) || (summary.tests.failed > 0)) ||
        ((summary.scaffolding.failed > 0) || (summary.scaffolding.failed > 0))) {
      display.print(c.redbg +   ' FAIL' + c.reset + c.red +
              ' some tests failed!'+c.reset);
      process.exit(1);
    } else {
      display.print(c.greenbg + '  OK ' + c.reset + c.green +
              ' all tests passed!'+c.reset);
      process.exit(0);
    }

  };
  return pub;
});
