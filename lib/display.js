if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(['jaribu/colors'], function (colors, undefined) {
 
  var pub = {},
      _ = {},
      c = colors,
      cfg = {
        type: 'console'
      },
      //console.log(c.reset); // reset colors
      passed = c.green + 'passed' + c.reset,
      failed = c.red + 'failed' + c.reset;


  if ((typeof window !== 'undefined') && (typeof window.document === 'object')) {
    cfg.type = 'browser';
  }

  function __browserWrite (line) {
    window.document.write(line);
  }


  pub.linebreak = function () {
    _.linebreak[cfg.type]();
  };
  _.linebreak = {
    console: function () {
      console.log("\n");
    },
    browser: function () {
      __browserWrite('<br />');
    }
  };

  pub.begin = function (num_suites, total_tests) {
    _.begin[cfg.type](num_suites, total_tests);
  };
  _.begin = {
    console: function (num_suites, total_tests) {
      console.log("\nrunning... " + num_suites + ' suites, ' + total_tests + ' tests.');
    },
    browser: function (num_suites, total_tests) {
      __browserWrite('<p>running... ' + num_suites + ' suites, ' + total_tests + ' tests.</p>');
    }
  };

  pub.print = function (msg) {
    _.print[cfg.type](msg);
  };
  _.print = {
    console: function (msg) {
      process.stdout.write(msg + "\n");
    },
    browser: function (msg) {
      __browserWrite(msg + '<br />');
    }
  };

  pub.write = function (msg) {
    _.write[cfg.type](msg);
  };
  _.write = {
    console: function (msg) {
      console.log('    ' + c.yellow + '> ' + msg + c.reset);
    },
    browser: function (msg) {
      __browserWrite(c.grey + ' > ' + msg + c.reset);
    }
  };


  /*
  * Suite info display functions
  */
  pub.suiteBorder = function () {
    _.suiteBorder[cfg.type]();
  };
  _.suiteBorder = {
    console: function () {
      process.stdout.write("\n\n\n==========\n= ");
    },
    browser: function () {
      __browserWrite('</p><p><br />==========<br />= ');
    }
  };

  // test or suite details
  pub.details = function (name, o) {
    _.details[cfg.type](name, o);
  };
  _.details = {
    console: function (name, o) {
      if (name === 'suite') {
        if (typeof o.name !== 'undefined') {
          process.stdout.write(c.cyan + o.name + c.reset + ' - ');
        }
        process.stdout.write(c.purple + o.desc + c.reset );
      } else {
        console.log("\n- " + '[' + o.parent.position +
            '/' + o.position + '] test ' + c.reset +
            c.purple + o.desc + c.reset);
      }
    },
    browser: function (name, o) {
      if (name === 'suite') {
        if (typeof o.name !== 'undefined') {
          __browserWrite(c.cyan + o.name + c.reset + ' - ');
        }
        __browserWrite(c.purple + o.desc + c.reset );
      } else {
        __browserWrite("<br />- " + '[' + o.parent.position +
            '/' + o.position + '] test ' + c.reset +
            c.purple + o.desc + c.reset);
      }
    }
  };

  pub.beforeEach = function () {
    _.beforeEach[cfg.type]();
  };
  _.beforeEach = {
    console: function () {
      process.stdout.write(' ... beforeEach ... ');
    },
    browser: function () {
      __browserWrite(' ... beforeEach ... ');
    }
  };

  pub.afterEach = function () {
    _.afterEach[cfg.type]();
  };
  _.afterEach = {
    console: function () {
      process.stdout.write('... afterEach ... ');
    },
    browser: function () {
      __browserWrite('... afterEach ... ');
    }
  };

  // setup intro
  pub.setup = function (name) {
    _.setup[cfg.type](name);
  };
  _.setup = {
    console: function (name) {
      if (name === 'suite') {
        process.stdout.write("\n" + '= setup ... ');
      } else {
        process.stdout.write('- test setup ... ');
      }
    },
    browser: function (name) {
      if (name === 'suite') {
        __browserWrite('<br />= setup ... ');
      } else {
        __browserWrite('<br />- test setup ... ');
      }
    }
  };

  // takedowns
  pub.takedown = function (name) {
    _.takedown[cfg.type](name);
  };
  _.takedown = {
    console: function (name) {
      if (name === 'suite') {
        process.stdout.write('... suite takedown ... ');
      } else {
        process.stdout.write("\n" + '- test takedown ... ');
      }
    },
    browser: function (name) {
      if (name === 'suite') {
        __browserWrite('... suite takedown ... ');
      } else {
        __browserWrite('<br />- test takedown ... ');
      }
    }
  };

  _.mergeMessages = {
    console: function (type, o) {
      var msg = '';
      if (o[type].failmsg) {
        msg = 'failed (' + o[type].failmsg + ')';
      } else {
        msg = 'failed';
      }
      return msg + " " + c.yellow + o[type]._message + c.reset;
    },
    browser: function (type, o) {
      var msg = '';
      if (o[type].failmsg) {
        msg = 'failed (' + o[type].failmsg + ')';
      } else {
        msg = 'failed';
      }
      return msg + " " + c.grey + o[type]._message + c.reset;
    }
  };


  /*
   * display test results
   */

  // FAIL
  pub.fail = function (type, o) {
    var msg = _.mergeMessages[cfg.type](type, o);
    _.fail[cfg.type](type, o, msg);
  };
  _.fail = {
    console: function (type, o, msg) {
      if (type === 'actual') {
        console.log("\n" + c.redbg + ' FAIL' + c.reset + ' ' + c.cyan + o.name  +
           c.reset + ' test ' + c.red + msg + c.reset);
      } else {
        console.log(c.red + msg + c.reset);
      }

      if (o[type]._stackTrace !== undefined) {
        console.log(c.greybg + 'Stack Trace:' + "\n" + c.reset + c.red + String(o[type]._stackTrace) + c.reset);
      }
    },
    browser: function (type, o, msg) {
      if (type === 'actual') {
        __browserWrite('<br />' + c.redbg + ' FAIL' + c.reset + ' ' + c.cyan + o.name  +
           c.reset + ' test ' + c.red + msg + c.reset);
      } else {
        __browserWrite('<p>' + c.red + msg + c.reset + '</p>');
      }

      if (o[type]._stackTrace !== undefined) {
        __browserWrite('<p>' + c.greybg + 'Stack Trace:' + "<br />" + c.reset + c.red + String(o[type]._stackTrace) + c.reset + '</p>');
      }
    }
  };

  // PASS
  pub.pass = function (type, o) {
    _.pass[cfg.type](type, o);
  };
  _.pass = {
    console: function (type, o) {
      if (type === 'actual') {
        process.stdout.write("\n" + c.greenbg + '  OK ' + c.reset + ' ' + c.cyan + o.name  +
              c.reset + ' test' + c.green + ' passed' + c.reset);
      } else {
        process.stdout.write(c.blue + 'completed ' + c.reset);
      }
    },
    browser: function (type, o) {
      if (type === 'actual') {
        __browserWrite('<br />' + c.greenbg + '  OK ' + c.reset + ' ' + c.cyan + o.name  +
              c.reset + ' test' + c.green + ' passed' + c.reset);
      } else {
        __browserWrite(c.blue + 'completed ' + c.reset);
      }
    }
  };


  /*
  * summary displays
  */
  pub.summary = function (num_suites, summary) {
    _.summary[cfg.type](num_suites, summary);
  };

  _.summary = {
    console: function (num_suites, summary) {
      console.log("\n\nSummary\n=======\n");
      process.stdout.write('scaffolding report  ');
      console.log(c.red + summary.scaffolding.failed + c.reset + ' failed,  ' +
            c.green + summary.scaffolding.passed + c.reset + ' passed, ' + 
            c.cyan + summary.scaffolding.skipped + c.reset + ' skipped, ' + 
            c.blue + summary.scaffolding.total + c.reset + ' total.');
      process.stdout.write('       test report  ');
      console.log(c.red + summary.tests.failed + c.reset + ' failed,  ' +
            c.green + summary.tests.passed + c.reset + ' passed, '+
            c.cyan + summary.tests.skipped + c.reset + ' skipped, '+
            c.blue + summary.tests.total + c.reset + ' total.');
      console.log("\n");
    },
    browser: function (num_suites, summary) {
      __browserWrite('<p>&nbsp;<br /></p><p><u>Summary</u></p>');
      __browserWrite('scaffolding report  ');
      __browserWrite('<p>' + c.red + summary.scaffolding.failed + c.reset + ' failed,  ' +
            c.green + summary.scaffolding.passed + c.reset + ' passed, '+
            c.cyan + summary.scaffolding.skipped + c.reset + ' skipped, '+
            c.blue + summary.scaffolding.total + c.reset + ' total.</p>');
      __browserWrite('       test report  ');
      __browserWrite('<p>' + c.red + summary.tests.failed + c.reset + ' failed,  ' +
            c.green + summary.tests.passed + c.reset + ' passed, '+
            c.cyan + summary.tests.skipped + c.reset +' skipped, '+
            c.blue + summary.tests.total + c.reset + ' total.</p>');
      __browserWrite('<p></p>');
    }
  };

  pub.failures = function (summary) {
    _.failures[cfg.type](summary);
  };
  _.failures = {
    console: function (summary) {
      var i, o;
      var failedScaffoldingLength = summary.scaffolding.failObjs.length;
      if (failedScaffoldingLength > 0) {
        process.stdout.write("\nfailed scaffolding:");
      }
      pub.linebreak();
      for (i = 0; i < failedScaffoldingLength; i += 1) {
        o = summary.scaffolding.failObjs[i];
        if (o.obj.parent !== undefined) {
          pub.details('suite', o.obj.parent);
          pub.details(o.name, o.obj);
        } else {
          pub.details('suite', o.obj);
        }
        process.stdout.write("\n" + o.type + ': ');
        pub.fail(o.type, o.obj);
      }

      var failedTestsLength = summary.tests.failObjs.length;
      if (failedTestsLength > 0) {
        console.log("\nfailed tests:");
      }
      for (i = 0; i < failedTestsLength; i += 1) {
        o = summary.tests.failObjs[i];
        pub.details('suite', o.obj.parent);
        pub.details(o.name, o.obj);
        pub.fail(o.type, o.obj);
        pub.linebreak();
      }
    },
    browser: function (summary) {
      var i, o;
      var failedScaffoldingLength = summary.scaffolding.failObjs.length;
      if (failedScaffoldingLength > 0) {
        __browserWrite("<br />failed scaffolding:");
      }
      pub.linebreak();
      for (i = 0; i < failedScaffoldingLength; i += 1) {
        o = summary.scaffolding.failObjs[i];
        if (o.obj.parent !== undefined) {
          pub.details('suite', o.obj.parent);
          pub.details(o.name, o.obj);
        } else {
          pub.details('suite', o.obj);
        }
        __browserWrite("\n" + o.type + ': ');
        pub.fail(o.type, o.obj);
      }

      var failedTestsLength = summary.tests.failObjs.length;
      if (failedTestsLength > 0) {
        __browserWrite("<br />failed tests:");
      }
      for (i = 0; i < failedTestsLength; i += 1) {
        o = summary.tests.failObjs[i];
        pub.details('suite', o.obj.parent);
        pub.details(o.name, o.obj);
        pub.fail(o.type, o.obj);
        pub.linebreak();
      }
    }
  };

  return pub;
});
