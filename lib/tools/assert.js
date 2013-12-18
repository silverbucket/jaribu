/**
 * Function: assert
 *
 * used to assert that a two variables are the same, works against objects, arrays
 * strings, etc.
 *
 * Parameters:
 *
 *   one - variable one
 *   two - variable two
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
  var msg;

  function isInArray(val, array) {
    if (!typeof array.length) {
      console.log('array length:'+array.length+' typeof: '+typeof array.length+' data:',array);
      msg = 'isInArray() array has no length.';
      return false;
    }
    for (var i = 0, num = array.length; i < num; i++) {
      if (typeof val === 'function') {
        if (''+array[i] === ''+val) {
          return true;
        }
      } else {
        if (array[i] === val) {
          return true;
        }
      }
    }
    return false;
  }

  function isEqual(a, b) {
    var p;
    for (p in a){
      if (b === undefined) { return false; }
      var av, bv;
      try {
        av = a[p];
        bv = b[p];
      } catch(e) {
        //console.log('DEBUG', a);
        msg = p + ": "+ a[p]+" doesn't match with second object property";
        return false;
      }
      // recursion
      if ((typeof av === 'object') || (typeof bv === 'object')) {
        if (compareObjects(av,bv) !== true){
          return false;
        }
      } else { //simple comparisons
        if (a[p] !== b[p]){
          // support for arrays of different order
          if (!isInArray(a[p],b)) {
            if (!msg) {
              msg = p + ": "+ a[p]+" not in second object";
            }
            return false;
          }
        }
      }
    }
    return true;
  }

  function compareObjects(one, two) {
    //can't use json encoding in case objects contain functions - recursion will fail
    //can't compare non-objects

    if (isEqual(one,two) !== true) { return false; }
    if (isEqual(two,one) !== true) { return false; }
    return true;
  }

  pub.assert = function (one, two, customMsg) {
    customMsg = customMsg ? (' -- ' + customMsg) : '';
    var args = Array.prototype.slice.call(arguments);
    var self = arguments.callee;
    if (typeof one === 'undefined') {
      if (typeof two === 'undefined') {
        return true;
      } else {
        msg = "first variable undefined, second is not.";
        return false;
      }
    }
    if ((typeof one === 'object') && (typeof two === 'object')) {
      if (compareObjects(one, two)) {
        return true;
      } else {
        if (msg) {
        } else if (customMsg) {
          msg = customMsg;
        } else {
          msg = "objects don't match";
        }
        return false;
      }
    }

    if (one === two) {
      return true;
    } else {
      msg = "'"+one+"' not equal to '"+two+"'" + customMsg;
      return false;
    }
    return false;
  };

  pub.assertHandler = function(one, two, customMsg) {
    var status = false;
    msg = undefined;
    if (this._assert(one, two, customMsg)) {
      status = true;
    } else {
      msg = (customMsg) ? 'failed: ' + customMsg : msg;
      status = false;
    }
    this.result(status, 'assert(): '+msg);
    return status;
  };
  pub.assertFailHandler = function(one, two, customMsg) {
    var status = true;
    msg = undefined;
    if (this._assert(one, two, customMsg)) {
      status = false;
    } else {
      msg = (customMsg) ? 'failed: ' + customMsg : 'objects match';
      status = true;
    }
    this.result(status, 'assertFail(): '+msg);
    return status;
  };
  pub.assertAndHandler = function(one, two, customMsg) {
    var status = false;
    msg = undefined;
    if (this._assert(one, two, customMsg)) {
      status = true;
    } else {
      msg = (customMsg) ? 'failed: ' + customMsg : msg;
      status = false;
      this.result(false, 'assertAnd(): '+msg);
    }
    return status;
  };
  pub.assertFailAndHandler = function(one, two, customMsg) {
    var status = false;
    msg = undefined;
    if (this._assert(one, two, customMsg)) {
      status = false;
      this.result(false, 'assertFailAnd(): '+msg);
    } else {
      msg = (customMsg) ? 'failed: ' + customMsg : 'objects match';
      status = true;
    }
    return status;
  };

  pub.assert.msg = '';
  return pub;
});
