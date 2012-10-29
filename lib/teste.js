if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define([
    'sys', 'jquery',
    './colors', './display',
    './tools/write', './tools/result',
    './tools/assert', './tools/assertType',
    './tools/Env', './fakes/Stub',
    './fakes/remoteStorageMock'],
function(sys, jquery, c, display, write, result, assert, assertType, Env,
         Stub, remoteStorageMock, undefined) {
    var suites = [];
    var err_msg = {};
    var pub = {};
    var _ = {};
    _.onComplete = function() {};
    var tools = {};
    tools['jQuery'] = jquery;

    /**
     * load a single suite json object into the library
     *
     * @param  {object}   s   suite object from test file
     * @return {boolean}      success of loading
     */
    pub.loadSuite = function(s) {
        //if (! s.name ) {
        //    err_msg = "suite requires a 'name' property";
        //    return false;
        //} else if (! s.desc ) {
        if (! s.desc ) {
            err_msg = "suite requires a 'desc' property";
            return false;
        } else if (! s.tests ) {
            err_msg = "suite requires a 'tests' array";
            return false;
        }

        /*
         * class definitions for suites, tests, and scaffolding
         */
        Stub.mock = {};
        Stub.mock.remoteStorage = remoteStorageMock; //requirejs('./fakes/remoteStorageMock');

        var runFunc = function(){this.result(true);};

        var Scaffolding = function() {};
        Scaffolding.prototype = {
            constructor: Scaffolding,
            type: "Scaffolding",
            tools: tools,
            write: write,
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
            timeout: 10000,
            env: undefined,
            run: runFunc,
            _result: undefined,
            _message: '', // messages coming from the test tools
            failmsg: '', // the failure message, used later for summarys
            result: result
        };

        function Test() {}
        Test.prototype = {
            constructor: Test,
            type: "Test",
            name: "",
            desc: "",
            tools: tools,
            write: write,
            setup: undefined,
            takedown: undefined,
            actual: undefined,
            next: undefined,
            prev: undefined,
            parent: undefined,
            position: null
        };

        function Suite() {}
        Suite.prototype = {
            constructor: Suite,
            type: "Suite",
            name: "",
            desc: "",
            tools: tools,
            write: write,
            setup: undefined,
            takedown: undefined,
            beforeEach: undefined,
            afterEach: undefined,
            env: undefined,
            testIndex: 0,
            next: undefined,
            prev: undefined,
            position: null
        };

        /*
         * Create all the test objects from the JSON data
         */
        var tests = [];
        var suite = new Suite(); // we define this early so we can assign it as parent to test objects
        var env = new Env();
        if (typeof s.timeout === 'number') {
            Test.prototype.timeout = s.timeout; // override test timeouts with Suite timeout
            Scaffolding.prototype.timeout = s.timeout; // override test timeouts with Suite timeout
        }
        var num_tests = s.tests.length;
        for (var i = 0; i < num_tests; i++) {
            if (! s.tests[i].desc ) {
                err_msg = s.name + ": test '" + s.tests[i].name +
                                "'' requires a 'desc' property";
                return false;
            } else if (typeof s.tests[i].run !== 'function') {
                err_msg = s.name + ": test '" + s.tests[i].name +
                                "'' requires a 'run' function";
                return false;
            }

            var test = new Test();
            //test.name = s.tests[i].name;
            test.desc = s.tests[i].desc;
            test.setup = new Scaffolding();
            test.actual = new Scaffolding();
            test.takedown = new Scaffolding();

            test.setup.env = env;
            test.actual.env = env;
            test.takedown.env = env;
            test.actual.run = s.tests[i].run;
            test.actual.willFail = undefined;
            if (typeof s.tests[i].setup === 'function') {
                test.setup.run = s.tests[i].setup;
            }
            if (typeof s.tests[i].takedown === 'function') {
                test.takedown.run = s.tests[i].takedown;
            }
            // figureout if there is a timeout to override default
            if (typeof s.tests[i].timeout === 'number') {
                test.actual.timeout = s.tests[i].timeout;
                test.setup.timeout = s.tests[i].timeout;
                test.takedown.timeout = s.tests[i].timeout;
            }
            if (typeof s.tests[i].willFail === 'boolean') {
                // if true, a failing test passes, and passing test fails
                test.actual.willFail = s.tests[i].willFail;
            }

            // set position related attributes to test object
            test.position = i;
            if (i !== 0) {
                test.prev = tests[i - 1];
                tests[i - 1].next = test;
            }
            test.parent = suite;
            //console.log(test);
            tests.push(test);
        }

        /*
         * Create the suite object
         */
        suite.name = s.name;
        suite.desc = s.desc;
        suite.setup = new Scaffolding();
        suite.takedown = new Scaffolding();
        suite.beforeEach = new Scaffolding();
        suite.afterEach = new Scaffolding();
        suite.setup.env = env;
        suite.takedown.env = env;
        suite.beforeEach.env = env;
        suite.afterEach.env = env;
        if (typeof s.setup === 'function') {
            suite.setup.run = s.setup;
        }
        if (typeof s.takedown === 'function') {
            suite.takedown.run = s.takedown;
        }
        if (typeof s.beforeEach === 'function') {
            suite.beforeEach.run = s.beforeEach;
        }
        if (typeof s.afterEach === 'function') {
            suite.afterEach.run = s.afterEach;
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
    pub.getErrorMessage = function() {
        return err_msg;
    };


    /**
     * returns the number of suites loaded
     * @return {number} number of suites loaded
     */
    pub.getNumSuites = function() {
        return suites.length;
    };


    /**
     * returns the total number of tests in all the suites combined.
     * @return {number} total number of tests
     */
    pub.getNumTests = function() {
        var total_tests = 0;
        var num_suites = pub.getNumSuites();
        for (var i = 0; i < num_suites; i++) {
            total_tests = total_tests + suites[i].tests.length;
        }
        return total_tests;
    };


    /**
     * begins the test cyle, by activating the first suite
     * @param  {function} onComplete    function to call when all tests are complete
     * @return {}
     */
    pub.begin = function(onComplete) {
        _.onComplete = onComplete;
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
    var pass = function(o, type) {
        // TODO: make sure we check for willFail here and fail tests
        // that would have otherwise passed

        display.pass(o, type);

        if (o.type === 'Suite') {  // Suite ----------------------------
            if (type === 'setup') {  // setup completed
                o.setup.status = true;
                // run the beforeEach for this suite
                run(o, 'beforeEach');
            } else if (type === 'beforeEach') {  // beforeEach completed
                o.beforeEach.status = true;
                // run the next test in suite
                var testIndex = o.testIndex;
                if (typeof o.tests[testIndex] === 'object') {
                    o.testIndex = o.testIndex + 1;
                    run(o.tests[testIndex], 'setup');
                } else {
                    run(o, 'takedown');
                }
            } else if (type === 'afterEach') {  // afterEach completed
                o.afterEach.status = true;
                if (typeof o.tests[o.testIndex] === 'object') {
                    // another test exists, run suite's beforeEachs
                    run(o, 'beforeEach');
                } else {
                    // end of tests, this suites takedown method
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
            if (type === 'setup') {  // setup completed
                o.setup.status = true;
                // run the test
                run(o, 'actual');
            } else if (type === 'takedown') { // takedown completed
                o.takedown.status = true;
                // call suites afterEach
                run(o.parent, 'afterEach');
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
    var fail = function(o, type, msg) {
        if (msg) {
            o[type].failmsg = msg;
        }

        display.fail(o, type);

        // if we've failed, we always perform the takedown.
        if (type === 'takedown') {
            // takedown has been done
            o.takedown.status = false;
            if (o.type === 'Test') {
                // run the suites afterEach method
                run(o.parent, 'afterEach');
            } else {
                // move on to the next suite.
                run(o.next, 'setup');
            }
        } else if (type === 'setup') {
            o.setup.status = false;
            run(o, 'takedown');
        } else if (type === 'actual') {
            // the actual test
            o.status = false;
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
     * @param  {string} type the type of task to be performed, if undefined assumes test
     */
    var run = function(o, type) {
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

        try {
            //local.run = local.run.bind(local, local.env.get()); // merge return result to res object
            local.run(local.env.get());
        } catch (err) {
            local.result(false, err);
        }

        var waitCount = 0;
        var waitInterval = 1000;
        (function waitResult() {
            if (local.result() === undefined)  {
                if (waitCount < local.timeout) {
                    waitCount = waitCount + waitInterval;
                    setTimeout(waitResult, waitInterval);
                } else {
                    if (local.willFail === true) {
                        display.print("this test failed, but that's OK because it's supposed to");
                        pass(o, type);
                    } else {
                        fail(o, type, 'timeout');
                    }
                }
            } else if (local.result() === false) {
                if (local.willFail === true) {
                    display.print("this test failed, but that's OK because it's supposed to");
                    pass(o, type);
                } else {
                    fail(o, type);
                }
            } else if (local.result() === true) {
                if ((typeof local.willFail === 'boolean') && (local.willFail === true)) {
                    display.print("this test passed, but that's " + c.red + 'NOT OK' + c.reset + " because it's supposed to fail.");
                    fail(o, type);
                } else {
                    pass(o, type);
                }
            } else {
                display.print(c.red + "ERROR GETTING RESULT" + c.reset);
                fail(o, type);
            }
        })();
    };

    var getSummary = function() {
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
        for (var i = 0; i < num_suites; i++) {
            var s = suites[i];

            summary.scaffolding.total = summary.scaffolding.total + 2;

            if (typeof s.setup.status === 'undefined') {
                summary.scaffolding.skipped = summary.scaffolding.skipped + 1;
            } else if (!s.setup.status) {
                summary.scaffolding.failed = summary.scaffolding.failed + 1;
                summary.scaffolding.failObjs.push({name: 'suite', type: 'setup', 'obj': s});
            } else {
                summary.scaffolding.passed = summary.scaffolding.passed + 1;
            }

            if (typeof s.takedown.status === 'undefined') {
                summary.scaffolding.skipped = summary.scaffolding.skipped + 1;
            } else if (!s.takedown.status) {
                summary.scaffolding.failed = summary.scaffolding.failed + 1;
                summary.scaffolding.failObjs.push({name: 'suite', type: 'takedown', 'obj': s});
            } else {
                summary.scaffolding.passed = summary.scaffolding.passed + 1;
            }

            var num_tests = suites[i].tests.length;
            for (var n = 0; n < num_tests; n++) {
                var t = suites[i].tests[n];
                summary.scaffolding.total = summary.scaffolding.total + 2;

                if (typeof t.setup.status === 'undefined') {
                    summary.scaffolding.skipped = summary.scaffolding.skipped + 1;
                } else if (!t.setup.status) {
                    summary.scaffolding.failed = summary.scaffolding.failed + 1;
                    summary.scaffolding.failObjs.push({name: 'test', type: 'setup', 'obj': t});
                } else {
                    summary.scaffolding.passed = summary.scaffolding.passed + 1;
                }

                if (typeof t.takedown.status === 'undefined') {
                    summary.scaffolding.skipped = summary.scaffolding.skipped + 1;
                } else if (!t.takedown.status) {
                    summary.scaffolding.failed = summary.scaffolding.failed + 1;
                    summary.scaffolding.failObjs.push({name: 'test', type: 'takedown', 'obj': t});
                } else {
                    summary.scaffolding.passed = summary.scaffolding.passed + 1;
                }

                summary.tests.total = summary.tests.total + 1;
                if (typeof t.status === 'undefined') {
                    summary.tests.skipped = summary.tests.skipped + 1;
                } else if (!t.status) {
                    summary.tests.failed = summary.tests.failed + 1;
                    summary.tests.failObjs.push({name: 'test', type: 'actual', 'obj': t});
                } else {
                    summary.tests.passed = summary.tests.passed + 1;
                }
            }
        }
        return summary;
    };

    var showSummary = function() {
        var num_suites = pub.getNumSuites();
        var summary = getSummary();

        display.summary(num_suites, summary);

        display.failures(summary);

        // call specified onComplete function
        _.onComplete();

        if ((summary.tests.failed > 0) || (summary.tests.failed > 0)) {
            display.print(c.redbg +   ' FAIL' + c.reset + c.red + ' some tests failed!'+c.reset);
            process.exit(1);
        } else {
            display.print(c.greenbg + '  OK ' + c.reset + c.green + ' all tests passed!'+c.reset);
            process.exit(0);
        }

    };
    return pub;
});
