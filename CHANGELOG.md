
- added stack traces for failures


teste v0.0.7 - 2012/11/06
=========================

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
=========================

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

