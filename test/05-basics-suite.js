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
        run: function (env, test) {
          test.assertType(undefined, 'undefined');
        }
      },
      {
        desc: "default methods work",
        run: function (env, test) {
          test.write('hello world');
          test.assert(1, 1);
          test.write('goodbye world');
        }
      },
      {
        desc: "testing async callback",
        run: function (env, test) {
          test.write('setting the timeout!');
          setTimeout(function (){
            test.write('test callback timeout!');
            test.result(true, 'got async callback');
          }, 2000);
          test.write('timeout set');
        }
      },
      {
        desc: '_message should not be set',
        run: function (env, test) {
          test.assert(test._message, '');
        }
      },
      {
        desc: 'test for tools object',
        run: function (env, test) {
          test.assertType(test.tools, 'object');
        }
      },
      {
        desc: 'test for jquery support',
        run: function (env, test) {
          test.assertType(test.tools.jQuery, 'function');
        }
      },
      {
        desc: "test double assertType statements",
        run: function (env, test) {
          test.assertTypeAnd(test.tools, 'object');
          test.assertType(test.tools.jQuery, 'function');
        }
      },
      {
        desc: "two different types should fail",
        willFail: true,
        run: function (env, test) {
          test.assertType('string', 1);
        }
      },
      {
        desc: "arrays should match",
        run: function(env, test) {
          a1 = ['one', 'two', 'shoe'];
          a2 = ['one', 'two', 'shoe'];
          test.assert(a1,a2);
        }
      },
      {
        desc: "arrays with same values but different orders should match",
        run: function (env, test) {
          a1 = ['one', 'shoe', 'two'];
          a2 = ['one', 'two', 'shoe'];
          test.assert(a1,a2);
        }
      },
      {
        desc: "arrays should match",
        run: function (env, test) {
          a1 = ['one', 'two', 'shoe'];
          a2 = ['one', 'two', 'shoe'];
          test.assertAnd(a1,a2);
          a1 = ['one', 'shoe', 'two'];
          a2 = ['one', 'two', 'shoe'];
          test.assert(a1,a2);
        }
      },
      {
        desc: "assertAnd fails, you shouldn't be able to set result true right after",
        willFail: true,
        run: function (env, test) {
          a1 = ['one', 'two', 'shoe'];
          a2 = ['one', 'two', 'boot'];
          test.assertAnd(a1,a2);
          test.result(true);
        }
      },
      {
        desc: "arrays with different orders should not match",
        willFail: true,
        run: function (env, test) {
          a1 = ['one', 'one', 'two'];
          a2 = ['one', 'two', 'shoe'];
          test.assert(a1,a2);
        }
      },
      {
        desc: "arrays with different orders should not match",
        willFail: true,
        run: function (env, test) {
          a1 = ['one', 'one', 'one'];
          a2 = ['one', 'two', 'shoe'];
          test.assert(a1,a2);
        }
      },
      {
        desc: 'objects should compare correctly',
        run: function (env, test) {
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
          test.assert(obj1, obj2);
          env.obj1 = obj1;
        }
      },
      {
        desc: "verify passing objects through env",
        run: function (env, test) {
          var obj2 = {
            foo: "bar",
            beer: "good",
            greed: "bad"
          };
          test.assert(env.obj1, obj2);
        }
      },
      {
        desc: "different objects should not test true",
        willFail: true,
        run: function (env, test) {
          var obj2 = {
            fresh: "prince",
            silver: "spoons"
          };
          test.assert(env.obj1, obj2);
        }
      },
      {
        desc: "arrays with the same elements but different orders should pass",
        run: function (env, test) {
          var o1 = [ 'dog', 'cat', 'aardvark'];
          var o2 = ['aardvark', 'dog', 'cat'];
          test.assert(o1, o2);
        }
      },
      {
        desc: "arrays with the different elements should not pass",
        willFail: true,
        run: function (env, test) {
          var o1 = [ 'dog', 'cat', 'aardvark'];
          var o2 = ['aardvark', 'cat'];
          test.assert(o1, o2);
        }
      },
      {
        desc: "assertFail inline use",
        run: function (env, test) {
          console.log(test);
          test.assertFail(false);
        }
      },
      {
        desc: "assertFail inline use - should fail",
        willFail: true,
        run: function (env, test) {
          test.assertFail(true, true);
        }
      },
      {
        desc: "assertTypeFail inline use",
        run: function (env, test) {
          test.write(typeof 'yes');
          test.assertTypeFailAnd('yes', 'array');
          test.assertType('yes', 'string');
        }
      },
      {
        desc: "assertTypeFail inline use - assertfail",
        run: function (env, test) {
          test.assertTypeFail('no', 'array');
        }
      },
      {
        desc: "test result messages",
        willFail: true,
        run: function (env, test) {
          test.result(false, 'fail message here');
        }
      },
      {
        desc: "try throw",
        willFail: true,
        run: function (env, test) {
          throw "i threw an exception";
        }
      },
     {
       desc: "try throw asynchronously",
       willFail: true,
       run: function (env, test) {
         setTimeout(function() {
           throw "I threw an exception later";
         }, 0);
       }
     },
      {
        desc: "assertTypeFail should fail",
        run: function (env, test) {
          test.assertTypeFail(0, 'object');
        }
      },
      {
        desc: "assertTypeFail should pass",
        willFail: true,
        run: function (env, test) {
          test.assertTypeFail(0, 'number');
        }
      },
      {
        desc: "fail message test",
        willFail: true,
        run: function (env, test) {
          test.result(false, 'test message');
        }
      },
      {
        desc: "fail message should be empty",
        run: function (env, test) {
          test.assert(test._message, '');
        }
      }
    ]
  });

  return suites;
});
