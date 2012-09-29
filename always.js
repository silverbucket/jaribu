
(function(undefined) {
	//'use strict';
    var sys = require('sys');
    var tools = {};
    tools['jQuery'] = require('jquery');

    var red, blue, reset;
    black = '\u001b[30m';
    red = '\u001b[31m';
    green = '\u001b[32m';
    yellow = '\u001b[33m';
    blue  = '\u001b[34m';
    purple  = '\u001b[35m';
    cyan  = '\u001b[36m';
    greybg  = '\u001b[40m';
    redbg  = '\u001b[41m';
    greenbg  = '\u001b[42m';
    yellowbg  = '\u001b[43m';
    bluebg  = '\u001b[44m';
    purplebg  = '\u001b[45m';
    cyanbg  = '\u001b[46m';
    reset = '\u001b[0m';
    console.log(reset);
    var passed = green + 'passed' + reset;
    var failed = red + 'failed' + reset;

    var files = ['./test/always-suite.js'];

    var always = function() {
        var suites = [];
        var err_msg = {};
        var pub = {};

        pub.getErrorMessage = function() {
            return err_msg;
        };
        pub.getNumSuites = function() {
            return suites.length;
        };

        /**
         * load a single suite json object into the library
         *
         * @param  {[object]}   s   [suite object from test file]
         * @return {[boolean]}      [success of loading]
         */
        pub.loadSuite = function(s) {
            if (! s.name ) {
                err_msg = "suite requires a 'name' property";
                return false;
            } else if (! s.desc ) {
                err_msg = "suite requires a 'desc' property";
                return false;
            } else if (! s.tests ) {
                err_msg = "suite requires a 'tests' array";
                return false;
            }


            /*
             * class definitions for suites, tests, and scaffolding
             */
            var writeFunc = function(text) {
                console.log('    ' + yellow + '> ' + text + reset);
            };
            function Scaffolding() {}
            Scaffolding.prototype = {
                constructor: Scaffolding,
                type: "Scaffolding",
                tools: tools,
                write: writeFunc,
                status: false,
                timeout: 10000,
                run: function(){this.result(true);},
                _result: undefined,
                result: function(result) {
                    if(result !== undefined){this._result = result;}
                    return this._result;
                }
            };

            function Test() {}
            Test.prototype = {
                constructor: Test,
                type: "Test",
                tools: tools,
                write: writeFunc,
                status: false,
                assertFail: false, // if true, a failing test passes, and passing test fails
                timeout: 10000,
                name: "",
                desc: "",
                setup: new Scaffolding(),
                takedown: new Scaffolding(),
                run: "",
                _result: undefined,
                result: function(result) {
                    if(result !== undefined){this._result = result;}
                    return this._result;
                },
                next: undefined,
                prev: undefined,
                parent: undefined,
                position: null
            };

            function Suite() {}
            Suite.prototype = {
                constructor: Suite,
                type: "Suite",
                tools: tools,
                write: writeFunc,
                timeout: 10000,
                name: "",
                desc: "",
                setup: new Scaffolding(),
                takedown: new Scaffolding(),
                beforeEach: new Scaffolding(),
                afterEach: new Scaffolding(),
                next: undefined,
                prev: undefined,
                position: null
            };
            /* */

            /*
             * Create all the test objects from the JSON data
             */
            var tests = [];
            var suite = new Suite(); // we define this early so we can assign it as parent to test objects
            if (typeof s.timeout === 'number') {
                Test.prototype.timeout = s.timeout; // override test timeouts with Suite timeout
                Scaffolding.prototype.timeout = s.timeout; // override test timeouts with Suite timeout
            }
            var num_tests = s.tests.length;
            for (var i = 0; i < num_tests; i++) {
                if (! s.tests[i].name ) {
                    err_msg = s.name + ": test[" + i + "] requires a 'name' property";
                    return false;
                } else if (! s.tests[i].desc ) {
                    err_msg = s.name + ": test '" + s.tests[i].name +
                                    "'' requires a 'desc' property";
                    return false;
                } else if (typeof s.tests[i].run !== 'function') {
                    err_msg = s.name + ": test '" + s.tests[i].name +
                                    "'' requires a 'run' function";
                    return false;
                }

                var test = new Test();
                test.name = s.tests[i].name;
                test.desc = s.tests[i].desc;
                test.run = s.tests[i].run;
                if (typeof s.tests[i].setup === 'function') {
                    test.setup.run = s.tests[i].setup;
                }
                if (typeof s.tests[i].takedown === 'function') {
                    test.takedown.run = s.tests[i].takedown;
                }
                // figureout if there is a timeout to override default
                if (typeof s.tests[i].timeout === 'number') {
                    test.timeout = s.tests[i].timeout;
                    test.setup.timeout = s.tests[i].timeout;
                    test.takedown.timeout = s.tests[i].timeout;
                }
                if (typeof s.tests[i].assertFail === 'boolean') {
                    test.assertFail = s.tests[i].assertFail;
                }

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
         * begins the test cyle, by activating the first suite
         * @return {[none]}
         */
        pub.begin = function() {
            sys.puts("\nrunning tests...");
            if (suites[0]) {
                run(suites[0], 'setup');
            }
        };
        var pass = function(o, type) {
            // TODO: make sure we check for assertFail here and fail tests
            // that would have otherwise passed

            if (type) {
                sys.puts(blue + 'completed' + reset);
            } else {
                sys.puts(greenbg + '  OK ' + reset + ' ' + cyan + o.name  +
                            reset + ' test' + green + ' passed' + reset);
            }

            if (o.type === 'Suite') {
                if (type === 'setup') {
                    // run first test in suite
                    o.setup.status = true;
                    run(o.tests.shift(), 'setup');
                } else if (type === 'takedown') {
                    o.takedown.status = true;
                    if (o.next) {
                        // move on to the next suite
                        run(o.next, 'setup');
                    } else {
                        showSummary();
                    }
                }
            } else {  // Test
                if (type === 'setup') {
                    // this test is ready to run
                    o.setup.status = true;
                    run(o);
                } else if (type === 'takedown') {
                    o.takedown.status = true;
                    if (o.next) {
                        run(o.next, 'setup');
                    } else {
                        // call the suites takedown method
                        run(o.parent, 'takedown');
                    }
                } else {
                    // test is complete
                    o.status = true;
                    run(o, 'takedown');
                }
            }
        };
        var fail = function(o, type, msg) {
            if (o.assertFail === true) {
                console.log("this test failed, but that's OK because it's supposed to");
                pass(o, type);
                return;
            }

            if (msg) {
                msg = 'failed (' + msg + ')';
            } else {
                msg = 'failed';
            }

            if (type) {
                sys.puts(red + msg + reset);
            } else {
                sys.puts(redbg + ' FAIL' + reset + ' ' + cyan + o.name  +
                            reset + ' test ' + red + msg + reset);
            }

            // run next test or display summary
            if (o.next) {
                // move on to the next suite
                run(o.next, 'setup');
            } else {
                showSummary();
            }
        };


        /**
         * generically handles each aspect of a suite/test setup/run/takedown
         * using the commonalities in each of the objects methods, and the
         * chaining references (o.next).
         *
         * @param  {[object]} o    [test or suite object]
         * @param  {[string]} type [the type of task to be performed, if undefined assumes test]
         */
        var run = function(o, type) {
            if ( type === 'setup' ) {
                if (o.type === 'Suite') {
                    console.log("\n==========\n= " + cyan + o.name + reset +
                                "\n= " + purple + o.desc + reset );
                    sys.print('= ::: setup ... ');
                } else {
                    console.log("\n-----\n- " + '[' + o.position +
                                '] running test ' + cyan + o.name + reset +
                                purple + "\n  " + o.desc + reset);
                    sys.print('- ::: setup ... ');
                }
                local = o.setup;
            } else if ( type === 'takedown' ) {
                if (o.type === 'Suite') {
                    sys.print("\n= ::: takedown ... ");
                } else {
                    sys.print('- ::: takedown ... ');
                }
                local = o.takedown;
            } else {
                // must be a test
                local = o;
            }
            local.run();

            var waitCount = 0;
            var waitInterval = 1000;
            (function waitResult() {
                if (local.result() === undefined)  {
                    //sys.print('... ');
                    if (waitCount < local.timeout) {
                        waitCount = waitCount + waitInterval;
                        setTimeout(waitResult, waitInterval);
                    } else {
                        fail(o, type, 'timeout');
                    }
                } else if (local.result() === false) {
                    fail(o, type);
                } else if (local.result() === true) {
                    pass(o, type);
                } else {
                    console.log(red + "ERROR GETTING RESULT" + reset);
                    fail(o, type);
                }
            })();
        };


        // TODO: the summary data should be accessible via methods to external
        // users. not just wrapped up in a summary display function.
        var showSummary = function() {
            console.log("\n\nSummary\n=======\n");
            var num_suites = suites.length;

            var summary = {
                'scaffolding': {
                    'total': 0,
                    'failures': 0
                },
                'tests': {
                    'total': 0,
                    'failures': 0
                }
            };

            for (var i = 0; i < num_suites; i++) {
                var s = suites[i];

                summary.scaffolding.total = summary.scaffolding.total + 2;
                if (!s.setup.status) {
                    summary.scaffolding.failures = summary.scaffolding.failures + 1;
                }
                if (!s.takedown.status) {
                    summary.scaffolding.failures = summary.scaffolding.failures + 1;
                }
                var num_tests = suites[i].tests.length;
                for (var n = 0; n < num_tests; n++) {
                    var t = suites[i].tests[n];
                    summary.scaffolding.total = summary.scaffolding.total + 2;
                    if (!t.setup.status) {
                        summary.scaffolding.failures = summary.scaffolding.failures + 1;
                    }
                    if (!t.takedown.status) {
                        summary.scaffolding.failures = summary.scaffolding.failures + 1;
                    }
                    summary.tests.total = summary.tests.total + 1;
                    if (!t.status) {
                        summary.tests.failures = summary.tests.failures + 1;
                    }

                }
            }

            sys.print('scaffolding failures  ');
            sys.print((summary.scaffolding.failures) ?
                            red+summary.scaffolding.failures+reset :
                            blue+summary.scaffolding.failures+reset);
            sys.puts('/'+purple+summary.scaffolding.total+reset);
            sys.print('       test failures  ');
            sys.print((summary.tests.failures) ?
                            red+summary.tests.failures+reset :
                            green+summary.tests.failures+reset);
            sys.puts('/'+purple+summary.tests.total+reset);
            sys.puts("\n");
            if ((summary.tests.failures > 0) || (summary.tests.failures > 0)) {
                sys.puts(redbg +   ' FAIL' + reset + red + ' some tests failed!'+reset);
                process.exit(1);
            } else {
                sys.puts(greenbg + '  OK ' + reset + green + ' all tests passed!'+reset);
                process.exit(0);
            }
        };
        return pub;
    }();


    var len_files = files.length;
    for (var i = 0; i < len_files; i++) {
        var s = require(files[0]);
        var suites = [];

        if (typeof s.name !== 'undefined') {
            suites.push(s);
        } else {
            suites = s;
        }

        var num_suites = suites.length;
        sys.print("\n"+'processing file '+files[i]+' '+num_suites+' suites found. ');
        for (var n = 0; n < num_suites; n++) {
            sys.print('...'+ (n+1));
            if (! always.loadSuite(suites[n]) ) {
                console.error("\n"+'unable to load file: ' + files[i]);
                console.error(always.getErrorMessage());
            }
        }
    }

    console.log("\n" + blue + 'suites loaded: ' + reset + always.getNumSuites());
    always.begin();
})();