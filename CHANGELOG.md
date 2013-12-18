CHANGELOG
=========

teste v0.1.1 - 2013/12/18
-------------------------

- fixed assert* informational messages. In some cases the automatic messages
  which indicated the location where the object match failed was being set as
  undefined.

teste v0.1.0 - 2013/12/10
-------------------------

- bugfix for custom error messages during `assert*()`'s. Previously it wasn only
  working for `assertAnd()`. ([issue #14](http://github.com/silverbucket/teste/issues/14))

- testing tools (functions) which previously needed the test object passed in,
  don't anymore.

- added support for testing for thrown exceptions. ([feature request #15](http://github.com/silverbucket/teste/issues/14))

		this.throws(function () {
			throw new Error('oops');
		}, Error, 'caught thrown exception');

- fixed an issue where the maximum call stack size was being exceeded when
 	running thousands of tests.

- refactoring and improvement of code clarity (using codeclimate.com as a
	benchmark)


teste v0.0.19 - 2013/11/15
--------------------------

- refactored the teste.loadSuite() function to reduce function complexity,
	splitting out class functions to separate files: `lib/Scaffolding.js`,
	`lib/Teste.js`, `lib/Suite.js`, `lib/helpers.js`.
	(https://codeclimate.com/github/silverbucket/teste).

- minor adjustments to logging behavior.

- if a teste returns a promise with a `fail` function, we can use that to catch
	unexpected errors.


teste v0.0.18 - 2013/07/10
--------------------------

- Fixes to WebSocketClient tool


teste v0.0.17 - 2013/06/23
--------------------------

- added `abortOnFail` boolean to suite options. If a test fails in that suite,
	entire execution is halted. This is useful for cases where you know
	everything is going to break if any tests in a suite fail.

  	suites.push({
	    desc: "checks for various version requirements",
	    abortOnFail: true,  // don't continue with further test suites if any
	    									  // tests in this suite fail
	    setup: function (env, test) {
	    	...
	    },
	    tests: [{...}]
	  });


teste v0.0.16 - 2013/03/20
--------------------------

- minor bugfixes for assert and WebSocketClient


teste v0.0.15 - 2013/03/09
--------------------------

- decreased wait interval so async tests complete faster.

- added done() as an alias to result() for tests.

- minor fixes, binded functions so they can be used as callbacks.


teste v0.0.14 - 2013/02/14
--------------------------

- bugfixes in the assert and WebSocketClient tools.


teste v0.0.13 - 2013/01/30
--------------------------

- created a new function for the `WebSocketClient`, called `sendWith()`. it's
	meant to replace all of the functionality of both `sendAndVerify()` and
	`sendWithCallback()`, using a single properties object (param object), this
	we the function can be extended, and modified in the future without worrying
	about param order, instead sending a single object with named properties.

	A list of all available properties at this time:

		// {
		//   send: JSON.stringify(data),
		//   expect: expected,
		//   confirmProps: confirmProps,
		//   autoVerify: true,
		//   onComplete: function() { }, // if callback function is called,
		//															 // verification is used with assertAnd,
		//                               // not assert.
		//
		//   onMessage: function() { },  // mutually exclusive to autoVerify, if
		//                               // autoVerify is set, this is not called
		//
		//   onError: function() { },  // mututall exclusive to autoVerify
		//                             // autoVerify is set, this is not called
		// }


teste v0.0.12 - 2013/01/28
--------------------------

- added support for confirmation messages in `WebSocketClient.sendAndVerify()`
	function. this allows you to say you are expecting a confirmation message
	before the actual result you eventually want to test.

		var confirmProps = {
			status: true,
			verb: 'confirm'
		};
		var data = {
			platform: "dispatcher",
			object: {
				secret: '1234567890'
			},
			verb: "register",
			rid: "123454"
		};
		var expected = {
			status: true,
			rid: "123454",
			verb: 'register',
			platform: "dispatcher"
		};
		env.connection.sendAndVerify(JSON.stringify(data), expected, test, confirmProps);

	Params are: data to send, expected result data, test object, confirm
	properties.


teste v0.0.11 - 2013/01/17
--------------------------

- modified WebSocketClient's sendAndVerify() function. Now it takes three
	params: send data, expected data, and test object. and you no long pass
	'messages' data to client.

		setup: function(env, test) {
			env.expected = { // struct of expected results for each http call
				setupTest: 'setupTest',
				test: {
					foo: "bar"
				},
				footwear: {
					leather: "boots",
					flip: "flops",
					block: "of wood"
				}
			};

			var client = new this.WebSocketClient({
				url: 'ws://localhost:9992/',
			});

			client.connect(function(connection) {
				env.connection = connection;
				env.connection.sendAndVerify('setupTest', env.expected.setupTest, test);
			});
		},
		tests: [
			{
				desc: 'auto validate websocket command',
				run: function (env, test) {
					env.connection.sendAndVerify('footwear', env.expected.footwear, this); // passes
				}
			},
			{
				desc: 'the first level of properties are the commands',
				run: function (env, test) {
				env.connection.sendAndVerify('blah', 'lalala', test); // fails
				}
			}
		]

teste v0.0.10 - 2013/01/15
--------------------------

- support for promises in tests:

		{
			desc: "async call making use of promises",
			run: func(env, test) {
				return someAsyncCall(function(result) {
					test.assert(result, 'success');
				});
			}
		}

- failing tests now get a generic stack trace to aid in debugging.

- added second parameter to all tests, the 'test' object will help in cases
	where you constantly have to re-assign 'this' due to async callbacks.

		{
			desc: 'test with this',
			run: func(env) {
				this.result(true);
			}
		},
		{
			desc: 'test with test param',
			run: func(env, test) {
				someAsyncFunction(function(status) {
					test.result(status);
				});
			}
		}

- assert*() functions now take an optional 3rd parameter which is printed along
	with the error message when the assert fails, for more informative
	information.

- bugfixes where assert*And() fails were slipping through the cracks


teste v0.0.9 - 2012/11/25
-------------------------

- added support for performing tests against WebSocket servers. If you provide
	the WebSocketClient with the expected data result for each command you can use
	auto verification to easily test the responses.

		setup: function(env) {
			env.expected = { // struct of expected results for each http call
				setupTest: 'setupTest',
				test: {
					foo: "bar"
				},
				footwear: {
					leather: "boots",
					flip: "flops",
					block: "of wood"
				}
			};

			var client = new this.WebSocketClient({
				url: 'ws://localhost:9992/',
				messages: env.expected  // data struct of commands and expected
											// results
			});

			var _this = this;
			client.connect(function(connection) {
				env.connection = connection;
				env.connection.sendAndVerify('setupTest', _this);
			});
		},
		tests: [
			{
				desc: 'auto validate websocket command',
				run: function(env) {
					env.connection.sendAndVerify('footwear', this); // passes
				}
			},
			{
				desc: 'the first level of properties are the commands',
				run: function(env) {
				env.connection.sendAndVerify('blah', this); // fails
				}
			}
		]


teste v0.0.8 - 2012/11/08
-------------------------

- added support for HTTP GET / POST testing, using a simple jQuery wrapper. All
	you can do with jQuery.ajax() applies. But for simple cases:

		{
			desc: 'http get example',
			run: function(env) {
				var _this = this;
				env.http = new this.Http()
				env.http.get('/', {
					success: function(data, textStatus, jqXHR) {
						_this.assert(data, <expected_data>);
					},
					error: function() {
						_this.result(false, 'failed');
					}
				});
			}
		},
		{
			desc: 'http post example',
			run: function(env) {
				var _this = this;
				env.http.post('/', {foo:'bar'}, {
					success: function(data, textStatus, jqXHR) {
						_this.assert(data, <expected_data>);
					},
					error: function() {
						_this.result(false, 'failed');
					}
				});
			}
		}

- added a simple JSON HTTP server. It takes a data struct as an argument and
	uses it to make URIs/results.

		setup: function(env) {
			var data = { // struct of expected results for each http call.
				test: { // the first set of properties are URIs, all children
						// of these properties are the data returned.
					foo: "bar"
				}
			};
			var server = new this.HttpServer({
				port: 9991,
				uris: data
			});
			var _this = this;
			server.run(function() {
				_this.write('http dummy server running');

				var http = new _this.Http({
					baseUrl: 'http://localhost:9991'
				});

				env.http.get('/test', {
					success: function(data, textStatus, jqXHR) {
						_this.assert(data, {foo:'bar'});
					},
					error: function() {
						_this.result(false, 'failed http request on /');
					}
				});
			});
		}

- added stack traces for failures


teste v0.0.7 - 2012/11/06
-------------------------

- added support for specifying suite files to run via. the command-line
	(@nilclass)

- switched to using requirejs by default for all file inclusions. Suite files
	now begin like this:

		if (typeof define !== 'function') {
			var define = require('amdefine')(module);
		}
		define(['requirejs'], function(requirejs, undefined) {
			var suites = [];
			// ... tests
			 return suites;
		});


teste v0.0.6 - 2012/10/28
-------------------------

- encase test and scaffolding runs in a try/catch clause

- now use the term 'willFail' for announcing ahead of time that a test with
	fail.

		{
			desc: "this test will fail, and that should pass",
			willFail: true,
			run: function(env) {
				this.result(false);
			}
		}

- display output now handled by the display.js library, which currently just
	supports console output, but can be extended to support HTML output (once we
	get in-browser testing working).

- added test functions `this.assertFail()`, `this.assertFailAnd()`,
	`this.assertTypeFail()`, `this.assertTypeFailAnd()`.


		{
			desc: "if an assertFail fails, that resolves to a passed test",
			run: function(env) {
				this.assertFailAnd(true, false);
				this.assertFail('blah', 'bad');
			}
		}

