![teste](https://raw.github.com/silverbucket/teste/master/design/teste_logo.png)

*a JavaScript (node.js) testing framework*

[![Build Status](https://secure.travis-ci.org/silverbucket/teste.png)](http://travis-ci.org/silverbucket/teste)
[![devDependency Status](https://david-dm.org/silverbucket/teste/dev-status.png)](https://david-dm.org/silverbucket/teste#info=devDependencies)
[![Code Climate](https://codeclimate.com/github/silverbucket/teste.png)](https://codeclimate.com/github/silverbucket/teste)

Intro
-----
Teste is a JavaScript testing framework built on node.js. It's meant to keep things simple, and make the barrier for writing tests as thin as possible.

Features
--------

**Shared environments** : a suite has an 'env' object which you can write to and that data will be available for any test in that suite.

	suites.push({
		name: "test suite",
		desc: "example",
		setup: function(env) {
			env.foo = 'bar';
		},
		tests: [
			{
				desc: "we should have the foo property",
				run: function(env, test) {
					test.assert(env.foo, 'bar');  // true
				}
			},
			{
				desc: "lets set a var",
				run: function(env, test) {
					env.pizza = 'slice';
					test.assert(env.pizza, 'slice');  // true
				}
			},
			{
				desc: "verify it's still there",
				run: function(env, test) {
					test.assert(env.pizza, 'slice');   // true
				}
			},
			{
				desc: "remove a variable",
				run: function(env, test) {
					delete env.foo;
					test.assertType(env.foo, 'undefined');   // true
				}
			},
			{
				desc: "we shouldn't be able to access the deleted property",
				willFail: true,
				run: function(env, test) {
					test.assert(env.foo, 'bar');   // false
				}
			}
		]
	});


## Mocks and Stubs
Technically they are all mocks, since they have info about whether they've been
called, and how many times, but can be used as stubs as well (which are
basically just mocks without meta data).

	var mock = new this.Stub(function(p1, p2) {
		console.log('hello world');
	});

	mock.called;  // false

	mock.numCalled;  // 0


	mock();  // hello world

	mock.called;  // true

	mock.numCalled;  // 1


## Testing for thrown exceptions
Catching thrown exceptions works with normal thrown exceptions or exceptions
thrown asyncronously. The interface is the same either way, just call the
function you want to test. If it throws an exception, the test passes.

	this.throws(function () {
		throw new Error('oops');
	}, Error, 'caught thrown exception');



[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/silverbucket/teste/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

