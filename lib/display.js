if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define(['../lib/colors'], function (colors, undefined) {
  var sys = require('util');
  var pub = {};
  var cfg = {};
  cfg.type = 'console';
  var _ = {};
  var c = colors;
  console.log(c.reset); // reset colors
  var passed = c.green + 'passed' + c.reset;
  var failed = c.red + 'failed' + c.reset;



  pub.linebreak = function () {
    _.linebreak[cfg.type]();
  };
  _.linebreak = {};
  _.linebreak.console = function () {
    sys.puts("\n");
  };

  pub.begin = function (num_suites, total_tests) {
    _.begin[cfg.type](num_suites, total_tests);
  };
  _.begin = {};
  _.begin.console = function (num_suites, total_tests) {
    sys.puts("\nrunning... "+num_suites+" suites, "+total_tests+" tests.");
  };


  pub.print = function (msg) {
    _.print[cfg.type](msg);
  };
  _.print = {};
  _.print.console = function (msg) {
    sys.print(msg+"\n");
  };

  /*
  * Suite info display functions
  */
  pub.suiteBorder = function () {
    _.suiteBorder[cfg.type]();
  };
  _.suiteBorder = {};
  _.suiteBorder.console = function () {
    sys.print("\n\n\n==========\n= ");
  };

  // test or suite details
  pub.details = function (name, o) {
    _.details[cfg.type](name, o);
  };
  _.details = {};
  _.details.console = function (name, o) {
    if (name === 'suite') {
      if (typeof o.name !== 'undefined') {
        sys.print(c.cyan + o.name + c.reset + ' - ');
      }
      sys.print(c.purple + o.desc + c.reset );
    } else {
      console.log("\n- " + '[' + o.parent.position +
          '/' + o.position + '] test ' + c.reset +
          c.purple + o.desc + c.reset);
    }
  };

  pub.beforeEach = function () {
    _.beforeEach[cfg.type]();
  };
  _.beforeEach = {};
  _.beforeEach.console = function () {
    sys.print(' ... beforeEach ... ');
  };

  pub.afterEach = function () {
    _.afterEach[cfg.type]();
  };
  _.afterEach = {};
  _.afterEach.console = function () {
    sys.print("... afterEach ... ");
  };

  // setup intro
  pub.setup = function (name) {
    _.setup[cfg.type](name);
  };
  _.setup = {};
  _.setup.console = function (name) {
    if (name === 'suite') {
      sys.print("\n= setup ... ");
    } else {
      sys.print('- test setup ... ');
    }
  };

  // takedowns
  pub.takedown = function (name) {
    _.takedown[cfg.type](name);
  };
  _.takedown = {};
  _.takedown.console = function (name) {
    if (name === 'suite') {
      sys.print("... suite takedown ... ");
    } else {
      sys.print("\n- test takedown ... ");
    }
  };

  _.mergeMessages = {};
  _.mergeMessages.console = function (type, o) {
    var msg = '';
    if (o[type].failmsg) {
      msg = 'failed (' + o[type].failmsg + ')';
    } else {
      msg = 'failed';
    }
    return msg + " " + c.yellow + o[type]._message + c.reset;
  };


  /*
   * display test results
   */

  // FAIL
  pub.fail = function (type, o) {
    var msg = _.mergeMessages[cfg.type](type, o);
    _.fail[cfg.type](type, o, msg);
  };
  _.fail = {};
  _.fail.console = function (type, o, msg) {
    if (type === 'actual') {
      sys.puts("\n" + c.redbg + ' FAIL' + c.reset + ' ' + c.cyan + o.name  +
         c.reset + ' test ' + c.red + msg + c.reset);
    } else {
      sys.puts(c.red + msg + c.reset);
    }

    if (o[type]._stackTrace !== undefined) {
      sys.puts(c.greybg+"Stack Trace:\n"+c.reset+c.red, o[type]._stackTrace);
      sys.puts(c.reset);
    }
  };

  // PASS
  pub.pass = function (type, o) {
    _.pass[cfg.type](type, o);
  };
  _.pass = {};
  _.pass.console = function (type, o) {
    if (type === 'actual') {
      sys.print("\n" + c.greenbg + '  OK ' + c.reset + ' ' + c.cyan + o.name  +
            c.reset + ' test' + c.green + ' passed' + c.reset);
    } else {
      sys.print(c.blue + 'completed ' + c.reset);
    }
  };


  /*
  * summary displays
  */
  pub.summary = function (num_suites, summary) {
    _.summary[cfg.type](num_suites, summary);
  };
  _.summary = {};
  _.summary.console = function(num_suites, summary) {
    console.log("\n\nSummary\n=======\n");
    sys.print('scaffolding report  ');
    sys.puts(c.red+summary.scaffolding.failed+c.reset+' failed,  ' +
          c.green+summary.scaffolding.passed+c.reset+' passed, '+
          c.cyan+summary.scaffolding.skipped+c.reset+' skipped, '+
          c.blue+summary.scaffolding.total+c.reset+' total.');
    sys.print('       test report  ');
    sys.puts(c.red+summary.tests.failed+c.reset+' failed,  ' +
          c.green+summary.tests.passed+c.reset+' passed, '+
          c.cyan+summary.tests.skipped+c.reset+' skipped, '+
          c.blue+summary.tests.total+c.reset+' total.');
    sys.puts("\n");
  };

  pub.failures = function (summary) {
    _.failures[cfg.type](summary);
  };
  _.failures = {};
  _.failures.console = function (summary) {
    var i, o;
    var failedScaffoldingLength = summary.scaffolding.failObjs.length;
    if (failedScaffoldingLength > 0) {
      sys.print("\nfailed scaffolding:");
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
      sys.print("\n"+o.type+": ");
      pub.fail(o.obj, o.type);
    }

    var failedTestsLength = summary.tests.failObjs.length;
    if (failedTestsLength > 0) {
      sys.puts("\nfailed tests:");
    }
    for (i = 0; i < failedTestsLength; i += 1) {
      o = summary.tests.failObjs[i];
      pub.details('suite', o.obj.parent);
      pub.details(o.name, o.obj);
      pub.fail(o.type, o.obj);
      pub.linebreak();
    }
  };

  return pub;
});