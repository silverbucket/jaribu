module.exports = function() {
var suites = [];

suites.push({
    name: "remoteStorage Mock tests",
    desc: "tests that the mock for remoteStorage testing behaves correctly",
    setup: function(env) {
        env.remoteStorage = new this.Stub.mock.remoteStorage({
            '12345': {
                'name': 'foo',
                'quote': 'bar'
            },
            '67890': {
                'name': 'yo',
                'quote': 'mama'
            },
            'abcde': {
                'name': 'pizza',
                'quote': 'toppings'
            },
            'fghij': {
                'name': 'code',
                'quote': 'word'
            }
        });
        console.log(env.remoteStorage.defineModule);
        this.assertTypeAnd(env.remoteStorage, 'function');
        this.assertTypeAnd(env.remoteStorage.baseClient, 'function');
        this.assertType(env.remoteStorage.defineModule, 'function');
    },
    tests: [
        {
            desc: "try loading a test module",
            run: function(env) {
                global.remoteStorage = env.remoteStorage;
                env.moduleImport = require('./resources/test_rs_module');
                this.assertType(env.moduleImport[1], 'function');
            }
        },
        {
            desc: "try to grab a listing",
            run: function(env) {
                env.module = env.moduleImport[1](remoteStorage.baseClient, remoteStorage.baseClient).exports;
                var obj = env.module.getIds();
                var should_be = ['12345', '67890', 'abcde', 'fghij'];
                this.assert(obj, should_be);
            }
        },
        {
            desc: "try to grab some data from the module",
            run: function(env) {
                var obj = env.module.get('12345');
                var should_be = {
                    'name': 'foo',
                    'quote': 'bar'
                };
                this.assert(obj, should_be);
            }
        },
        {
            desc: "try save some data",
            run: function(env) {
                var data = {
                    'name': 'ninja',
                    'quote': 'gaiden'
                };
                env.module.add(data, 'n777-n777');
                var obj = env.module.get('n777-n777');
                var should_be = {
                    'name': 'ninja',
                    'quote': 'gaiden'
                };
                this.assert(obj, should_be);
            }
        }
    ]
});

return suites;
}();
