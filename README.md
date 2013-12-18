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

## Asserts
You can use the assert family of functions to compare values with each other
(objects, arrays, strings, types).

### assert()
The `assert()` function compares two objects for truthiness and passes or fails
the test based on the result of the comparison.

 		assert(object1, object2, "testing object1 and 2 are the same")

### assertAnd()
Same as `assert()` except does not pass the test automatically when the result
is true. If the objects *do not* match, however, the test will fail.

### assertFail()
Behaves the opposite of `assert()`, test will pass if the objects do not match.

### assertFailAnd()
Behaves the opposite of `assertAnd()`, test will not fail if objects do not
match, and will fail automatically if objects match.

### assertType()
The `assertType()` function tests the type of a given variable *(object, string,
boolean, etc.)*.

		assertType(object, 'object', "testing object is actually an object")

### assertTypeAnd()
Same as `assertType()` except does not pass the test automatically when the
result is true. If the object type is *incorrect*, however, the test will fail.

### assertTypeFail()
Behaves the opposite of `assertType()`, test will succeed if the type of
object is incorrect, and will automatically fail if the types match.

### assertTypeFailAnd()
Behaves the opposite of `assertTypeAnd()`, test will not fail if the type of
object is incorrect, and will automatically fail if the types match.

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

