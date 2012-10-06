var testsuite = function() {
    var pub = {};
    var _this = this;
    var testlib2 = require('./testlib2.js');

    joinStrings = function(s1, s2) {
        return s1 + s2;
    };

    pub.stringBeast = function(s1, s2, s3, s4) {
        var c1, c2;
        if ((testlib2.checkString(s1)) && (testlib2.checkString(s2))) {
            c1 = joinStrings(s1, s2);
        }
        if ((testlib2.checkString(s3)) && (testlib2.checkString(s4))) {
            c2 = joinStrings(s3, s4);
        }
        return joinStrings(c1, c2);
    };

    return pub;
}();
module.exports = testsuite;

