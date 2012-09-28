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
            setup: function() {return true;},
            run: function() {
                setTimeout(function(){
                    console.log('test callback timeout!');
                    this.result(true);
                }, 2000);
            }
        },
        {
            name: "jquery",
            desc: 'test for jquery support',
            setup: function() { return true; },
            run: function() {
                if (jQuery) {
                    test.result(true);
                } else {
                    this.result(false);
                }
            }
        }
    ];

    return suite;
}();
