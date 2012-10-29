/**
 * Function: result
 *
 * Handler function to set the tests internal result status
 *
 * Parameters:
 *
 *   r - result true/false
 *   message - optional test to be displayed with the failure
 *
 * Returns:
 *
 *   return result
 */
 if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define([], function() {
    var result = function(r, message) {
        if(r !== undefined){this._result = r;}
        if(message !== undefined){this._message = message;}
        return this._result;
    };
    return result;
});
