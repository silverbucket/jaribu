module.exports = function(undefine) {
    var requirejs = require('requirejs');
    requirejs.config({
        //Pass the top-level main.js/index.js require
        //function to requirejs so that node modules
        //are loaded relative to the top-level JS file.
        baseUrl: __dirname,
        nodeRequire: require
    });
    var teste = requirejs('./teste');
    return teste;
}();

