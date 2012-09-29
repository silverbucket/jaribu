(function(undefined) {
	//'use strict';
    var files = ['./test/always-suite.js'];

    var sys = require('sys');
    var always = require('./lib/always.js');

console.log(always);
    var len_files = files.length;
    for (var i = 0; i < len_files; i++) {
        var s = require(files[0]);
        var suites = [];

        if (typeof s.name !== 'undefined') {
            suites.push(s);
        } else {
            suites = s;
        }

        var num_suites = suites.length;
        for (var n = 0; n < num_suites; n++) {
            sys.print('...'+ (n+1));
            if (! always.loadSuite(suites[n]) ) {
                console.error("\n"+'unable to load file: ' + files[i]);
                console.error(always.getErrorMessage());
            }
        }
    }
    always.begin();
})();