var http = require('http');
var send = require('send');

var app = http.createServer(function (req, res) {
  send(req, req.url)
    .root('./static')
    .pipe(res);
}).listen(3000);

console.log('in year 3000');
