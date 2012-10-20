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
 module.exports = function(undefined) {
    var result = function(r, message) {
        if(r !== undefined){this._result = r;}
        if(message !== undefined){this._message = message;}
        return this._result;
    };
    return result;
}();
