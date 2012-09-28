/*var util = (function() {
    var jQuery = require('jquery');
    var pub = {};
    pub.get = function(url) {

    }

    return pub;
});*/

(function(undefined) {
	//'use strict';
    var jQuery = require('jquery');
    var red, blue, reset;
    red   = '\u001b[31m';
    blue  = '\u001b[34m';
    green = '\u001b[32m';
    yellow = '\u001b[33m';
    reset = '\u001b[0m';
    console.log(reset);

    var files = ['./test/demo-suite.js'];


    var always = function() {
        var suites = [];
        var err_msg = {};
        var pub = {};

        pub.hello = function() { return 'hello'; };
        pub.getErrorMessage = function() {
            return err_msg;
        };
        pub.getNumSuites = function() {
            return suites.length;
        };

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

            function funcTpl() {}
            funcTpl.prototype = {
                constructor: funcTpl,
                run: function(){this.result(true);},
                _result: undefined,
                result: function(result) {
                    if(result){this._result = result;}
                    return this._result;
                }
            };

            function Test() {}
            Test.prototype = {
                constructor: Test,
                type: "Test",
                name: "",
                desc: "",
                setup: new funcTpl(),
                takedown: new funcTpl(),
                run: "",
                _result: undefined,
                result: function(result) {
                    if(result){this._runResult = result;}
                    return this._runResult;
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
                name: "",
                desc: "",
                setup: new funcTpl(),
                takedown: new funcTpl(),
                beforeEach: new funcTpl(),
                afterEach: new funcTpl(),
                next: undefined,
                prev: undefined,
                position: null
            };

            var tests = [];
            var suite = new Suite(); // we define this early so we can assign it as parent to test objects
            var num_tests = s.tests.length;
            for (var i = 0; i < num_tests; i++) {
                if (! s.tests[i].name ) {
                    err_msg = s.name + ": test[" + i + "] requires a 'name' property";
                    return false;
                } else if (! s.tests[i].desc ) {
                    err_msg = s.name + ": test '" + s.tests[i].name + "'' requires a 'desc' property";
                    return false;
                } else if (typeof s.tests[i].run !== 'function') {
                    err_msg = s.name + ": test '" + s.tests[i].name + "'' requires a 'run' function";
                    return false;
                }

                var test = new Test();
                test.name = s.tests[i].name;
                test.desc = s.tests[i].desc;
                test.run = s.tests[i].run;

                if (typeof s.tests[i].setup === 'function') {
                    var tsetup = new funcTpl();
                    tsetup.run = s.tests[i].setup;
                    test.setup = tsetup;
                }

                if (typeof s.tests[i].takedown === 'function') {
                    var ttakedown = new funcTpl();
                    ttakedown.run = s.tests[i].takedown;
                    test.takedown = ttakedown;
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


            suite.name = s.name;
            suite.desc = s.desc;
            if (typeof s.setup === 'function') {
                var setup = new funcTpl();
                setup.run = s.setup;
                suite.setup = setup;
            }
            if (typeof s.takedown === 'function') {
                var takedown = new funcTpl();
                takedown.run = s.takedown;
                suite.takedown = takedown;
            }
            if (typeof s.beforeEach === 'function') {
                var beforeEach = new funcTpl();
                beforeEach.run = s.beforeEach;
                suite.beforeEach = beforeEach;
            }
            if (typeof s.afterEach === 'function') {
                var afterEach = new funcTpl();
                afterEach.run = s.afterEach;
                suite.afterEach = afterEach;
            }

            suite.tests = s.tests;
            // set position related attributes to suite object
            num_suites = suites.length;
            suite.position = num_suites;
            if (num_suites !== 0) {
                suite.prev = suites[num_suites - 1];
                suites[num_suites - 1].next = suite;
            }
            suites.push(suite);
            return true;
        };

        /**
         * iterates through the suite objects and begins the test cyle
         * @return none
         */
        pub.begin = function() {
            console.log("beginning always teste's");
            if (suites[0]) {
                run(suites[0], 'setup');
            }
        };
        var pass = function(o, task) {
            if (task) {
                task = ' ' + task + ' ';
            } else {
                task = ' ';
            }
            console.log(reset + o.type + ' ' + blue + o.name + reset +
                        task + green + 'passed' + reset);
        };
        var fail = function(o, task) {
            console.log(reset + o.type + blue + o.name + reset +
                        task + red + ' faled' + reset);
        };

        var run = function(o, type) {
            if ( type === 'setup' ) {
                if (o.type === 'Suite') {
                    console.log("\n" + 'suite ' + blue + o.name + reset);
                } else {
                    console.log('[' + o.position + '] running test ' + blue + o.name + reset);
                }
                console.log('::: setup');
                console.log(o);
                local = o.setup;
                o.setup.run();
            } else if ( type === 'takedown' ) {
                local = o.takedown;
                local.run();
            } else {
                // must be a test
                local = o;
                local.run();
            }

            (function waitResult() {
                if (local.result() === undefined)  {
                    console.log('...');
                    setTimeout(waitResult, 500);
                } else {
                    if (local.result() === true) {
                        pass(o, type);
                        if (o.type === 'Suite') {
                            if (type === 'setup') {
                                // run first test in suite
                                next_test = o.tests.shift();
                                run(next_test, 'setup');
                            } else if (type === 'takedown') {
                                if (o.next) {
                                    // move on to the next suite
                                    run(o.next, 'setup');
                                }
                            }
                        } else {
                            // this test is ready to run
                            if (type === 'setup') {
                                run(o);
                            } else if (type === 'takedown') {
                                if (o.next) {
                                    run(o.next, 'setup');
                                } else {
                                    // call the suites takedown method
                                    run(o.parent, 'takedown');
                                }
                            } else {
                                // test is complete
                                run(o, 'takedown');
                            }
                        }
                    } else if (local.result() === false) {
                        fail(o, type);
                    } else {
                        console.log(red + "ERROR GETTING RESULT" + reset);
                        fail(o);
                    }
                }
            })();
        };

        var runAux = function(name, func) {
            //console.log(yellow);
            if (func()) {
                console.log(reset + name + green + ' passed' + reset);
            } else {
                console.log(reset + name + red + ' failed' + reset);
            }
        };

        var test = {};
        test.startPrep = function(test) {
            runAux('... beforeEach', suite.beforeEach);
            console.log("\n----------\ntest " + blue + test.name + reset);
            console.log(blue + test.desc + reset);
            runAux('prep for ' + blue + test.name + reset, test.prep);
            runTest(test);
        };

        test.start = function(test) {
            test._result = undefined;
            test.result = function(result) {
                if (result) {
                    test._result = result;
                }
                return test._result;
            };

            console.log(reset + 'running test ' + test.name + '...' + yellow);
            test.run();
            console.log(reset + 'waiting for test to compelte ... ' + yellow);

            (function waitResult() {
                if (test.result() === undefined)  {
                    console.log('.. ');
                } else {

                    console.log('im here so result must be set', test.result());

                    if (test.result() === true) {
                      console.log(reset + 'test ' + blue + test.name + green + ' passed' + reset);
                        waiting = false;
                    } else if (test.result() === false) {
                        console.log(reset + 'test ' + blue + test.name + red + ' failed' + reset);
                        waiting = false;
                    } else { console.log(red + "ERROR TESTING RESULT" + reset); }
                    endTest(test);
                }
                setTimeout(waitResult, 500);
            })();
            console.log(reset + 'end of runtest func');
        };

        function endTest(test) {
            console.log("----------\n");
            runAux('... afterEach', suite.afterEach);
        };

        function processSuite(suite) {
            console.log("\n==========\n" + 'suite ' + blue + suite.name + reset);
            console.log(blue + suite.desc + reset);

            runAux('::: setup', suite.setup);
            var len_tests = suite.tests.length;
            for (var i = 0; i < len_tests; i++) {
                var test = suite.tests[i];
                prepTest(test);
            }
            runAux('::: takedown', suite.takedown);
            console.log();
        };

        return pub;
    }();


    var len_files = files.length;
    for (i = 0; i < len_files; i++) {
        var s = require(files[0]);

        if (! always.loadSuite(s) ) {
            console.error('unable to load file: ' + files[i]);
            console.error(always.getErrorMessage());
        }
    }

    console.log(blue + 'suites loaded: ' + reset + always.getNumSuites());
    always.begin();

})();