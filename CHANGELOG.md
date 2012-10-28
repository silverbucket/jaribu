teste v0.0.6 - 2012/10/28
=========================

- now use the term 'willFail' for announcing ahead of time that a test with fail.


		{
			desc: "this test will fail, and that should pass",
			willFail: true,
			run: function(env) {
				this.result(false);
			}
		}

- display output now handled by the display.js library, which currently just supports console output, but can be extended to support HTML output (once we get in-browser testing working).

- added test functions `this.assertFail()`, `this.assertFailAnd()`, `this.assertTypeFail()`, `this.assertTypeFailAnd()`.


		{
			desc: "if an assertFail fails, that resolves to a passed test",
			run: function(env) {
				this.assertFailAnd(true, false);
				this.assertFail('blah', 'bad');
			}
		}

