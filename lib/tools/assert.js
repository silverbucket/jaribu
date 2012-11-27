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
  function isInArray(val,array) {
    var numArray = array.length;
    var i;
    for (i = 0; i < numArray; i++) {
      if (array[i] === val) {
        return true;
      }
    }
    return false;
  }

  function isEqual(a, b) {
    var p;
    for(p in a){
      if (b === undefined) { return false; }
      var av = a[p], bv = b[p];
      //recursion
      if (typeof av === 'object' || typeof bv === 'object') {
        if (compareObjects(av,bv) !== true){
          return false;
        }
      } else { //simple comparisons
        if(a[p] !== b[p]){
          // support for arrays of different order
          if(!isInArray(a[p],b)) {
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

    if (isEqual(one,two) !== true) { return false };
    if (isEqual(two,one) !== true) { return false };
    return true;
  }

  pub.assert = function (one, two) {
    var args = Array.prototype.slice.call(arguments);
    var self = arguments.callee;
    if (typeof one === 'undefined') {
      if (typeof two === 'undefined') {
        return true;
      } else {
        return false;
      }
    }
    if ((typeof one === 'object') && (typeof two === 'object')) {
      if (compareObjects(one, two)) {
        return true;
      } else {
        self.msg = "objects don't match";
        return false;
      }
    }

    if (one === two) {
      return true;
    } else {
      self.msg = "'"+one+"' not equal to '"+two+"'";
      return false;
    }
    return false;
  };

  pub.assertHandler = function(one, two) {
    var status = false;
    var msg;
    if (this._assert(one, two)) {
      status = true;
    } else {
      msg = this._assert.msg;
      status = false;
    }
    this.result(status, 'assert(): '+msg);
    return status;
  };
  pub.assertFailHandler = function(one, two) {
    var status = true;
    var msg;
    if (this._assert(one, two)) {
      status = false;
    } else {
      msg = this._assert.msg;
      status = true;
    }
    this.result(status, 'assertFail(): '+msg);
    return status;
  };
  pub.assertAndHandler = function(one, two) {
    var status = false;
    var msg;
    if (this._assert(one, two)) {
      status = true;
    } else {
      msg = this._assert.msg;
      status = false;
      this.result(false, 'assertAnd(): '+msg);
    }
    return status;
  };
  pub.assertFailAndHandler = function(one, two) {
    var status = false;
    var msg;
    if (this._assert(one, two)) {
      status = false;
      this.result(false, 'assertFailAnd(): '+msg);
    } else {
      msg = this._assert.msg;
      status = true;
    }
    return status;
  };

  pub.assert.msg = '';
  return pub;
});
