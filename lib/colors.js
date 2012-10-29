if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define([], function() {
    var colors = {
        black: '\u001b[30m',
        red: '\u001b[31m',
        green: '\u001b[32m',
        yellow: '\u001b[33m',
        blue: '\u001b[34m',
        purple: '\u001b[35m',
        cyan: '\u001b[36m',
        greybg: '\u001b[40m',
        redbg: '\u001b[41m',
        greenbg: '\u001b[42m',
        yellowbg: '\u001b[43m',
        bluebg: '\u001b[44m',
        purplebg: '\u001b[45m',
        cyanbg: '\u001b[46m',
        reset: '\u001b[0m'
    };
    return colors;
});