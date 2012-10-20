/**
 * Function: assertType
 *
 * used to assert that a variable is of a specified type
 *
 * Parameters:
 *
 *   data - the variable to test
 *   type - the type the variable should be checked against (function, object, etc)
 *
 * Returns:
 *
 *   return boolean
 */
module.exports = function() {
    var assertType = function(data, type) {
        var args = Array.prototype.slice.call(arguments);
        var self = arguments.callee;
        if (typeof data === type) {
            return true;
        } else {
            self.msg = "property of type: '"+typeof data+"' no equal to type: '"+type+"'";
            return false;
        }
    };
    assertType.msg = '';
    return assertType;
}();