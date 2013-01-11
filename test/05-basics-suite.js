if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define([], function () {
  var suites = [];

  suites.push({
    name: "teste basics",
    desc: "collection of tests to test the test framework (basics)",
    tests: [
      {
        desc: "undefined should be undefined",
        run: function (env) {
          this.assertType(undefined, 'undefined');
        }
      },
      {
        desc: "default methods work",
        run: function (env) {
          this.write('hello world');
          this.assert(1, 1);
          this.write('goodbye world');
        }
      },
      {
        desc: "testing async callback",
        run: function () {
          this.write('setting the timeout!');
          var _this = this;
          setTimeout(function (){
            _this.write('test callback timeout!');
            _this.result(true, 'got async callback');
          }, 2000);
          this.write('timeout set');
        }
      },
      {
        desc: '_message should not be set',
        run: function () {
          this.assert(this._message, '');
        }
      },
      {
        desc: 'test for tools object',
        run: function () {
          this.assertType(this.tools, 'object');
        }
      },
      {
        desc: 'test for jquery support',
        run: function () {
          this.assertType(this.tools.jQuery, 'function');
        }
      },
      {
        desc: "test double assertType statements",
        run: function () {
          this.assertTypeAnd(this.tools, 'function');
          this.assertType(this.tools.jQuery, 'function');
        }
      },
      {
        desc: "two different types should fail",
        willFail: true,
        run: function () {
          this.assertType('string', 1);
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
        run: function () {
          a1 = ['one', 'shoe', 'two'];
          a2 = ['one', 'two', 'shoe'];
          this.assert(a1,a2);
        }
      },
      {
        desc: "arrays should match",
        run: function () {
          a1 = ['one', 'two', 'shoe'];
          a2 = ['one', 'two', 'shoe'];
          this.assertAnd(a1,a2);
          a1 = ['one', 'shoe', 'two'];
          a2 = ['one', 'two', 'shoe'];
          this.assert(a1,a2);
        }
      },
      {
        desc: "assertAnd fails, you shouldn't be able to set result true right after",
        willFail: true,
        run: function () {
          a1 = ['one', 'two', 'shoe'];
          a2 = ['one', 'two', 'boot'];
          this.assertAnd(a1,a2);
          this.result(true);
        }
      },
      {
        desc: "arrays with different orders should not match",
        willFail: true,
        run: function () {
          a1 = ['one', 'one', 'two'];
          a2 = ['one', 'two', 'shoe'];
          this.assert(a1,a2);
        }
      },
      {
        desc: "arrays with different orders should not match",
        willFail: true,
        run: function () {
          a1 = ['one', 'one', 'one'];
          a2 = ['one', 'two', 'shoe'];
          this.assert(a1,a2);
        }
      },
      {
        desc: 'objects should compare correctly',
        run: function (env) {
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
        run: function (env) {
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
        willFail: true,
        run: function (env) {
          var obj2 = {
            fresh: "prince",
            silver: "spoons"
          };
          this.assert(env.obj1, obj2);
        }
      },
      {
        desc: "arrays with the same elements but different orders should pass",
        run: function (env) {
          var o1 = [ 'dog', 'cat', 'aardvark'];
          var o2 = ['aardvark', 'dog', 'cat'];
          this.assert(o1, o2);
        }
      },
      {
        desc: "arrays with the different elements should not pass",
        willFail: true,
        run: function (env) {
          var o1 = [ 'dog', 'cat', 'aardvark'];
          var o2 = ['aardvark', 'cat'];
          this.assert(o1, o2);
        }
      },
      {
        desc: "assertFail inline use",
        run: function (env) {
          console.log(this);
          this.assertFail(false);
        }
      },
      {
        desc: "assertFail inline use - should fail",
        willFail: true,
        run: function (env) {
          this.assertFail(true, true);
        }
      },
      {
        desc: "assertTypeFail inline use",
        run: function (env) {
          this.write(typeof 'yes');
          this.assertTypeFailAnd('yes', 'array');
          this.assertType('yes', 'string');
        }
      },
      {
        desc: "assertTypeFail inline use - assertfail",
        run: function (env) {
          this.assertTypeFail('no', 'array');
        }
      },
      {
        desc: "test result messages",
        willFail: true,
        run: function (env) {
          this.result(false, 'fail message here');
        }
      },
      {
        desc: "try throw",
        willFail: true,
        run: function (env) {
          throw "i threw an exception";
        }
      },
      {
        desc: "assertTypeFail should fail",
        run: function (env) {
          this.assertTypeFail(0, 'object');
        }
      },
      {
        desc: "assertTypeFail should pass",
        willFail: true,
        run: function (env) {
          this.assertTypeFail(0, 'number');
        }
      },
      {
        desc: "fail message test",
        willFail: true,
        run: function (env) {
          this.result(false, 'test message');
        }
      },
      {
        desc: "fail message should be empty",
        run: function (env) {
          this.assert(this._message, '');
        }
      }
    ]
  });

  return suites;
});
