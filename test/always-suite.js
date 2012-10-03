module.exports = function() {
var suites = [];

suites.push({
    name: "always basics",
    desc: "collection of tests to test the test framework (basics)",
    tests: [{
        name: "default",
        desc: "default methods work",
        run: function() {
            this.write('hello world');
            if (1 === 1) {
                this.result(true);
            } else {
                this.result(false);
            }
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
            if (typeof this.tools === 'object') {
                this.result(true);
            } else {
                this.result(false);
            }
        }
    },
    {
        name: "jquery",
        desc: 'test for jquery support',
        run: function() {
            if (typeof this.tools.jQuery === 'function') {
                this.result(true);
            } else {
                this.result(false);
            }
        }
    }]
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
                if (1 === 1) {
                    this.result(true);
                } else {
                    this.result(false);
                }
            }
        },
        {
            name: "env",
            desc: 'test for environment object',
            setup: function(env) {
                var test = {
                    fooBar: 'baz'
                };
                this.env.set(test);
                this.result(true);
            },
            run: function(res) {
                if (typeof res === 'object') {
                    if (typeof res.fooBar === 'string') {
                        if (res.fooBar === 'baz') {
                            this.result(true);
                            return;
                        }
                    }
                }
                this.result(false);
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
        this.env.set(env);
        this.result(true); },
    takedown: function(env) {
        if (typeof env.foo === 'undefined') {
            this.result(false);
            return;
        } else if (env.foo === 'bar') {
            this.result(true);
            return;
        }
        this.result(false);
    },
    beforeEach: function(env) {
        if (typeof env.foo === 'undefined') {
            this.result(false);
            return;
        } else if (env.foo === 'bar') {
            this.result(true);
            env.counter = env.counter + 1;
            return;
        }
        this.result(false);
    },
    afterEach: function(env) {
        if (typeof env.foo === 'undefined') {
            this.result(false);
            return;
        } else if (env.foo === 'bar') {
            this.write('counter: '+env.counter);
            this.result(true);
            return;
        }
        this.result(false);
    },
    timeout: 3000,
    tests: [
        {
            name: "env test1",
            desc: "making sure setup env is here",
            run: function(env) {
                if (typeof env.foo === 'undefined') {
                    this.result(false);
                    return;
                } else if (env.foo === 'bar') {
                    this.result(true);
                    return;
                }
            }
        }
    ]
});
return suites;
}();
