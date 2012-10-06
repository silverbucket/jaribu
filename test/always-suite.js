module.exports = function() {
var suites = [];

suites.push({
    name: "always basics",
    desc: "collection of tests to test the test framework (basics)",
    tests: [
        {
            name: "default",
            desc: "default methods work",
            run: function() {
                this.write('hello world');
                this.assert(1, 1);
                this.write('goodbye world');
            }
        },
        {
            name: "async",
            desc: "testing async callback",
            run: function() {
                this.write('setting the timeout!');
                var _this = this;
                setTimeout(function(){
                    _this.write('test callback timeout!');
                    _this.result(true);
                }, 2000);
                this.write('timeout set');
            }
        },
        {
            name: "tools",
            desc: 'test for tools object',
            run: function() {
                this.assertType(this.tools, 'object');
            }
        },
        {
            name: "jquery",
            desc: 'test for jquery support',
            run: function() {
                this.assertType(this.tools.jQuery, 'function');
            }
        },
        {
            name: 'obj compare1',
            desc: 'objects should compare correctly',
            run: function(env) {
                obj1 = {
                    foo: "bar",
                    beer: "good",
                    greed: "bad"
                };
                obj2 = {
                    foo: "bar",
                    beer: "good",
                    greed: "bad"
                };
                this.assert(obj1, obj2);
                env.obj1 = obj1;
            }
        },
        {
            name: "obj compare2",
            desc: "verify passing objects through env",
            run: function(env) {
                obj2 = {
                    foo: "bar",
                    beer: "good",
                    greed: "bad"
                };
                this.assert(env.obj1, obj2);
            }
        },
        {
            name: "obj compare3",
            desc: "different objects should not test true",
            assertFail: true,
            run: function(env) {
                obj2 = {
                    fresh: "prince",
                    silver: "spoons"
                };
                this.assert(env.obj1, obj2);
            }
        }
    ]
});




suites.push({
    name: "always override",
    desc: "testing overriden methods and timeouts",
    setup: function() { this.result(true); },
    takedown: function() { this.result(true); },
    beforeEach: function() { this.result(true); },
    afterEach: function() { this.result(true); },
    timeout: 3000,
    tests: [
        {
            name: "timeout",
            desc: "testing async timeout failure",
            assertFail: true, // this test SHOULD fail
            run: function() {
                var _this = this;
                setTimeout(function(){
                    _this.result(true);
                }, 4000);
            }
        },
        {
            name: "overload",
            desc: "overloaded methods work",
            setup: function() { this.result(true); },
            takedown: function() { this.result(true); },
            run: function() {
                this.assert(1, 1);
            }
        },
        {
            name: "env",
            desc: 'test for environment object',
            setup: function(env) {
                env.test = {
                    fooBar: 'baz'
                };
                this.result(true);
            },
            run: function(res) {
                this.assert(res.fooBar,'baz');
            }
        },
        {
            name: "async",
            desc: "testing extended async callback",
            run: function() {
                var _this = this;
                setTimeout(function(){
                    _this.result(true);
                }, 2000);
            }
        },
        {
            name: "timeout overload",
            desc: "testing async callback with extended wait period",
            timeout: 4000,
            run: function() {
                var _this = this;
                setTimeout(function(){
                    _this.result(true);
                }, 3000);
            }
        },
        {
            name: "async timeout",
            desc: "testing async timeout failure",
            assertFail: true, // this test SHOULD fail
            timeout: 4000,
            run: function() {
                var _this = this;
                setTimeout(function(){
                    _this.result(true);
                }, 5000);
            }
        }
    ]
});


suites.push({
    name: "available environment",
    desc: "make sure the environment is accessible from within all phases of test",
    setup: function(env) {
        env.foo = 'bar';
        env.counter = 0;
        this.result(true); },
    takedown: function(env) {
        this.assert(env.foo, 'bar');
    },
    beforeEach: function(env) {
        env.counter = env.counter + 1;
        this.assert(env.foo, 'bar');
    },
    afterEach: function(env) {
        this.write('counter: '+env.counter);
        this.assert(env.foo, 'bar');
    },
    timeout: 3000,
    tests: [
        {
            name: "env test1",
            desc: "making sure setup env is here",
            run: function(env) {
                this.assert(env.foo, 'bar');
            }
        },
        {
            name: "env test2",
            desc: "making sure counter is updating",
            run: function(env) {
                this.assert(env.counter, 2);
            }
        },
        {
            name: "env test3",
            desc: "sandbox test env but keep setup env",
            run: function(env) {
                env.testVar = 'yarg';
                this.assert(env.foo, 'bar');
            }
        },
        {
            name: "env test4",
            desc: "making sure var from setup3 is not here, and counter is at 4",
            run: function(env) {
                this.assert(env.counter, 4);
            }
        }

    ]
});


suites.push({
    name: "testlib",
    desc: "testing external lib",
    setup: function(env) {
        env.testlib = require('../lib/testlib.js');
        console.log('testlib: ', env.teslib);
        if (this.assert(env.testlib, undefined)) {
            this.write('fail');
            this.result(false);
        } else {
            this.write('pass');
            console.log(env.testlib);
            this.result(true);
        }
    },
    tests: [
        {
            name: "libtest1",
            desc: "verify external lib works",
            run: function(env) {
                console.log(env.testlib);
                rstring = env.testlib.stringBeast('yo', 'mama', 'so', 'stupid');
                this.assert(rstring, 'yomamasostupid');
            }
        },
        {
            name: "libtest2",
            desc: "verify external lib works (break)",
            assertFail: true,
            run: function(env) {
                rstring = env.testlib.stringBeast('yo', 'mama', 'so', 'smelly');
                this.assert(rstring, 'yomamasostupid');
            }
        }
    ]
});

return suites;
}();
