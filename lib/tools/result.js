/**
 * Function: result
 *
 * Handler function to set the tests internal result status
 *
 * Parameters:
 *
 *   r - result true/false
 *   message - optional test to be displayed with the failure
 *   trace - optional stack trace
 *
 * Returns:
 *
 *   return result
 */
if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define([], function () {
  var result = function (r, message, trace) {
    if (typeof(this._result) !== 'undefined') { return this._result; }
    if (r !== undefined) { this._result = r; }
    if (message !== undefined) { this._message = message; }
    if (trace !== undefined) {
      this._stackTrace = trace;
    } else {
      if (r === false) {
        try {
          throw new Error();
        } catch (e) {
          this._stackTrace = e.stack;
        }
      }
    }

    return this._result;
  };
  return result;
});
