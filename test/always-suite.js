module.exports = function() {
var suites = [];

suites.push({
    name: "always basics",
    desc: "collection of tests to test the test framework (basics)",
    tests: [
        {
            desc: "default methods work",
            run: function() {
                this.write('hello world');
                this.assert(1, 1);
                this.write('goodbye world');
            }
        },
        {
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
            desc: 'test for tools object',
            run: function() {
                this.assertType(this.tools, 'object');
            }
        },
        {
            desc: 'test for jquery support',
            run: function() {
                this.assertType(this.tools.jQuery, 'function');
            }
        },
        {
            desc: "arrays should match",
            run: function() {
                a1 = ['one', 'two', 'shoe'];
                a2 = ['one', 'two', 'shoe'];
                this.assert(a1,a2);
            }
        },
        {
            desc: "arrays with same values but different orders should match",
            run: function() {
                a1 = ['one', 'shoe', 'two'];
                a2 = ['one', 'two', 'shoe'];
                this.assert(a1,a2);
            }
        },
        {
            desc: "arrays with different orders should not match",
            assertFail: true,
            run: function() {
                a1 = ['one', 'one', 'two'];
                a2 = ['one', 'two', 'shoe'];
                this.assert(a1,a2);
            }
        },
        {
            desc: "arrays with different orders should not match",
            assertFail: true,
            run: function() {
                a1 = ['one', 'one', 'one'];
                a2 = ['one', 'two', 'shoe'];
                this.assert(a1,a2);
            }
        },
        {
            desc: 'objects should compare correctly',
            run: function(env) {
                var obj1 = {
                    foo: "bar",
                    beer: "good",
                    greed: "bad"
                };
                var obj2 = {
                    foo: "bar",
                    beer: "good",
                    greed: "bad"
                };
                this.assert(obj1, obj2);
                env.obj1 = obj1;
            }
        },
        {
            desc: "verify passing objects through env",
            run: function(env) {
                var obj2 = {
                    foo: "bar",
                    beer: "good",
                    greed: "bad"
                };
                this.assert(env.obj1, obj2);
            }
        },
        {
            desc: "different objects should not test true",
            assertFail: true,
            run: function(env) {
                var obj2 = {
                    fresh: "prince",
                    silver: "spoons"
                };
                this.assert(env.obj1, obj2);
            }
        },
        {
            desc: "arrays with the same elements but different orders should pass",
            run: function(env) {
                var o1 = [ 'dog', 'cat', 'aardvark'];
                var o2 = ['aardvark', 'dog', 'cat'];
                this.assert(o1, o2);
            }
        },
        {
            desc: "arrays with the different elements should not pass",
            assertFail: true,
            run: function(env) {
                var o1 = [ 'dog', 'cat', 'aardvark'];
                var o2 = ['aardvark', 'cat'];
                this.assert(o1, o2);
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
            desc: "overloaded methods work",
            setup: function() { this.result(true); },
            takedown: function() { this.result(true); },
            run: function() {
                this.assert(1, 1);
            }
        },
        {
            desc: 'test for environment object',
            setup: function(env) {
                env.fooBar = 'baz';
                this.result(true);
            },
            run: function(env) {
                this.assert(env.fooBar,'baz');
            }
        },
        {
            desc: "testing extended async callback",
            run: function() {
                var _this = this;
                setTimeout(function(){
                    _this.result(true);
                }, 2000);
            }
        },
        {
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
            desc: "making sure setup env is here",
            run: function(env) {
                this.assert(env.foo, 'bar');
            }
        },
        {
            desc: "making sure counter is updating",
            run: function(env) {
                this.assert(env.counter, 2);
            }
        },
        {
            desc: "sandbox test env but keep setup env",
            run: function(env) {
                env.testVar = 'yarg';
                this.assert(env.foo, 'bar');
            }
        },
        {
            desc: "making sure var from setup3 is not here, and counter is at 4",
            run: function(env) {
                this.assert(env.counter, 4);
            }
        },
        {
            desc: "we shouldnt have variables from always library",
            run: function(env) {
                if (typeof greybg !== 'undefined') {
                    this.result(false);
                } else {
                    this.result(true);
                }
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
            //console.log(env.testlib);
            this.result(true);
        }
    },
    tests: [
        {
            desc: "verify external lib works",
            run: function(env) {
                console.log(env.testlib);
                rstring = env.testlib.stringBeast('yo', 'mama', 'so', 'stupid');
                this.assert(rstring, 'yomamasostupid');
            }
        },
        {
            desc: "verify external lib works (break)",
            assertFail: true,
            run: function(env) {
                rstring = env.testlib.stringBeast('yo', 'mama', 'so', 'smelly');
                this.assert(rstring, 'yomamasostupid');
            }
        }
    ]
});

suites.push({
    desc: "should be able to set up dummy functions (stubs)",
    tests: [
        {
            desc: "make a stub function that returns its params",
            run: function(env) {
                var stub = new this.Stub(function(p) {
                    return p;
                });
                this.write('stub.called: '+stub.called);
                var ret = stub('yarg');
                this.write('ret:'+ret);
                this.write('stub.called: '+stub.called);
                this.assert(ret, 'yarg');
            }
        }
    ]
});

suites.push({
    desc: "dummy functions (stubs) should give some basic info about usage",
    setup: function(env) {
        env.myStub = new this.Stub(function(p) {
            return p;
        });
        this.result(true);
    },
    tests: [
        {
            desc: "called is false",
            run: function(env) {
                this.assert(env.myStub.called, false);
            }
        },
        {
            desc: "env func works",
            run: function(env) {
                ret = env.myStub('yarg');
                this.assert(ret, 'yarg');
            }
        },
        {
            desc: "called is true",
            run: function(env) {
                this.assert(env.myStub.called, true);
            }
        },
        {
            desc: "numCalled is 1",
            run: function(env) {
                this.assert(env.myStub.numCalled, 1);
            }
        }
    ]
});

return suites;
}();
