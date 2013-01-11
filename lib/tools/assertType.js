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
if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}
define([], function (undefined) {
  var pub = {};
  pub.assertType = function (data, type, customMsg) {
    customMsg = customMsg ? (' -- ' + customMsg) : '';
    var args = Array.prototype.slice.call(arguments);
    var self = arguments.callee;
    if (typeof data === type) {
      return true;
    } else {
      self.msg = "property of type: '"+typeof data+"' no equal to type: '"+type+"'" + customMsg;
      return false;
    }
  };
  pub.assertTypeHandler = function (obj, type, customMsg) {
    var status = false;
    var msg;
    if (this._assertType(obj, type, customMsg)) {
      status = true;
    } else {
      msg = this._assertType.msg;
      status = false;
    }
    this.result(status, msg);
    return status;
  };
  pub.assertTypeFailHandler = function (obj, type, customMsg) {
    var status = false;
    var msg;
    if (this._assertType(obj, type, customMsg)) {
      status = false;
    } else {
      msg = this._assertType.msg;
      status = true;
    }
    this.result(status, msg);
    return status;
  };
  pub.assertTypeAndHandler = function (obj, type, customMsg) {
    var status = false;
    var msg ;
    if (this._assertType(obj, type, customMsg)) {
      status = true;
    } else {
      msg = this._assertType.msg;
      status = false;
      this.result(false, msg);
    }
    return status;
  };
  pub.assertTypeFailAndHandler = function (obj, type, customMsg) {
    var status = false;
    var msg ;
    if (this._assertType(obj, type, customMsg)) {
      status = false;
      this.result(false, msg);
    } else {
      msg = this._assertType.msg;
      status = true;
    }
    return status;
  };

  pub.assertType.msg = '';
  return pub;
});