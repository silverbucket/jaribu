var testsuite2 = function() {
    var pub = {};

    pub.checkString = function(s) {
        if (typeof s === 'string') {
            return true;
        } else {
            return false;
        }
    };

    return pub;
}();
module.exports = testsuite2;