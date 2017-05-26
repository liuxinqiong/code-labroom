var exec = require('cordova/exec');

var  logMode= {
  enable: function() {
    exec(null, null, 'LogMode', 'enable', []);
  },
  disable:function(){
  	exec(null, null, 'LogMode', 'disable', []);
  }
};

module.exports =  logMode;