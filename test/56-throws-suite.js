if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define([], function () {
  var suites = [];

  suites.push({
    desc: "should be able to throw and catch errors as part of tests",
    tests: [

      {
        desc: "just a throw, no other params",
        run: function (env, test) {

          function causeTrouble() {
            throw new Error("I'm nothing but trouble.");
          }

          this.throws(causeTrouble);
        }
      },

      {
        desc: "make a function that throws an error and test it",
        run: function (env, test) {

          function causeTrouble() {
            throw new Error("I'm nothing but trouble.");
          }

          this.throws(causeTrouble, Error, "raised Error");
        }
      },

      {
        desc: "make a simple string error",
        run: function (env, test) {
          this.throws(
            function() {
              throw "error";
            },
            "throws with just a message, no expected"
          );
        }
      },

      {
        desc: "throw an async error",
        run: function (env, test) {
          function causeTrouble() {
            setTimeout(function () {
              throw new Error("I'm nothing but trouble.");
            }, 1000);
          }

          this.throws(causeTrouble, Error, "raised Error from async call");
        }
      },

      {
        desc: "throw custom error",
        run: function (env, test) {

          function CustomError( message ) {
            this.message = message;
          }
          CustomError.prototype.toString = function() {
            return this.message;
          };

          this.throws(
            function() {
              throw new CustomError();
            },
            CustomError,
            "raised error is an instance of CustomError"
          );
          // throws(
          //   function() {
          //   throw new CustomError("some error description");
          // },
          // /description/,
          // "raised error message contains 'description'"
          // );

        }
      },

      {
        desc: "throw an async error - and fail!",
        willFail: true,
        run: function (env, test) {
          function causeTrouble() {
            setTimeout(function () {
              throw new Error("I'm nothing but trouble.");
            }, 1000);
          }
        }
      }

    ]
  });


  // suites.push({
  //   desc: "dummy functions (stubs) should give some basic info about usage",
  //   setup: function (env) {
  //     env.myStub = new this.Stub(function (p) {
  //       return p;
  //     });
  //     this.result(true);
  //   },
  //   tests: [
  //     {
  //       desc: "called is false",
  //       run: function (env) {
  //         this.assert(env.myStub.called, false);
  //       }
  //     },
  //     {
  //       desc: "env func works",
  //       run: function (env) {
  //         ret = env.myStub('yarg');
  //         this.assert(ret, 'yarg');
  //       }
  //     },
  //     {
  //       desc: "called is true",
  //       run: function (env) {
  //         this.assert(env.myStub.called, true);
  //       }
  //     },
  //     {
  //       desc: "numCalled is 1",
  //       run: function (env) {
  //         this.assert(env.myStub.numCalled, 1);
  //       }
  //     }
  //   ]
  // });

  return suites;
});