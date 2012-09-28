module.exports = function() {
    var suite = {};
    suite.name = "demo suite";
    suite.desc = "collection of tests for proof of concept";
    suite.setup = function() { this.result(true); };
    suite.takedown = function() { this.result(true); };
    suite.beforeEach = function() { this.result(true); };
    suite.afterEach = function() { this.result(true); };

    suite.tests = [
        {
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
            name: "async test",
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
        }
    ];

    return suite;
}();
