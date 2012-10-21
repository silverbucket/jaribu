Teste
=====
*a JavaScript (node.js) testing framework*

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
				run: function(env) {
					this.assert(env.foo, 'bar');  // true
				}
			},
			{
				desc: "lets set a var",
				run: function(env) {
					env.pizza = 'slice';
					this.assert(env.pizza, 'slice');  // true
				}
			},
			{
				desc: "verify it's still there",
				run: function(env) {
					this.assert(env.pizza, 'slice');   // true
				}
			},
			{
				desc: "remove a variable",
				run: function(env) {
					delete env.foo;
					this.assertType(env.foo, 'undefined');   // true
				}
			},
			{
				desc: "we shouldn't be able to access the deleted property",
				assertFail: true,
				run: function(env) {
					this.assert(env.foo, 'bar');   // false
				}
			}
		]
	});

**Support for mocks/stubs** technically they are mocks, since they have info about whether they've been called, and how many times, but can be used as stubs as well.

	var mock = new this.Stub(function(p1, p2) {
		console.log('hello world');
	});

	mock.called;  // false
	
	mock.numCalled;  // 0

	
	mock();  // hello world

	mock.called;  // true
	
	mock.numCalled;  // 1

**Built in remoteStorage.js module testing mocks** Teste has built in support for testing remoteStorage.js modules. You pass it some test data and it can mimick the baseClient, allowing you to test your module from the command-line.

    suites.push({
    	name: "module tests",
    	desc: "tests for my brand-new remoteStorage.js module",
    	setup: function(env) {
        	env.remoteStorage = new this.Stub.mock.remoteStorage({
            	// dummy data, schema defined in test module
            	'12345': {
                	'name': 'foo',
                	'quote': 'bar'
            	},
            	'abcde': {
                	'name': 'blah',
                	'quote': 'lala'
            	},
            	'work/67890': {
                	'name': 'hello',
                	'quote': 'world'
            	},
        	});

        	this.assertTypeAnd(env.remoteStorage, 'function');
        	this.assertTypeAnd(env.remoteStorage.baseClient, 'function');
        	this.assertType(env.remoteStorage.defineModule, 'function');
        },
        takedown: function(env) {
        	env.remoteStorage.destroy();
        }
        tests: [
	        {
	            desc: "load a test module",
	            run: function(env) {
	            	global.remoteStorage = env.remoteStorage;
	                env.moduleImport = require('./resources/test_rs_module');
	                this.assertTypeAnd(env.moduleImport[1], 'function');
	                env.module = env.moduleImport[1](remoteStorage.baseClient, remoteStorage.baseClient).exports;
	                this.assertType(env.module, 'object');
	            }
	        },
	        {
	            desc: "try to get a listing",
	            run: function(env) {
	                var obj = env.module.getIds();
	                var should_be = ['12345', abcde'];
	                this.assert(obj, should_be);
	            }
	        }
	    ]
	});

Status
------
[![Build Status](https://secure.travis-ci.org/silverbucket/teste.png)](http://travis-ci.org/silverbucket/teste)
Teste is not feature complete, is still very much a research project and should be considered in alpha state.


