// NodeJS webserver for hosting index.html
var connect = require('connect');
var serveStatic = require('serve-static');
var open = require('open');

connect().use(serveStatic(__dirname)).listen(8081, function(){
  open('http://127.0.0.1:8081');
  console.log('Server running on 8081...');
});
