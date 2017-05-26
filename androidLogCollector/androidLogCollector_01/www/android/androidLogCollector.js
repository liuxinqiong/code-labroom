var exec = require('cordova/exec');

var androidLogCollector = {
  openLogger: function(successFn, failureFn) {
    exec(successFn, failureFn, 'AndroidLogCollector', 'openLogger', []);
  }
};

module.exports = androidLogCollector;