var server = require('./server.js');
var cp = require('child_process');
var rootpath = 'www';
var sv = server.create({
    port: '9587',
    host: '120.76.244.22',
    root: rootpath
});

