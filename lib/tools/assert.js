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
module.exports = function(undefined) {
    function isInArray(val,array) {
        var numArray = array.length;
        for (var i = 0; i < numArray; i++) {
            if (array[i] === val) {
                return true;
            }
        }
        return false;
    }

    function isEqual(a,b){
        for(var p in a){
            var av = a[p], bv = b[p];
            //recursion
            if (typeof av === 'object' || typeof bv === 'object') {
                if (Ext.ux.util.Object.compare(av,bv) !== true){
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

        if (isEqual(one,two) !== true) return false;
        if (isEqual(two,one) !== true) return false;
        return true;
    }

    var assert = function(one, two) {
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
            self.msg = "param 1: '"+one+"' not equal to param 2: '"+two+"'";
            return false;
        }
        return false;
    };
    assert.msg = '';
    return assert;
}();
