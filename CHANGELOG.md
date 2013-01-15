CHANGELOG
=========


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

- added second parameter to all tests, the 'test' object will help in cases where
	you constantly have to re-assign 'this' due to async callbacks.

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

