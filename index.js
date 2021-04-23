#!/usr/bin/evn node

var app = require('./app');
var debug = require('debug')('demo-server:server');
var http = require('http');

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// 标准化一个端口
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

// 错误事件
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ?
    'Pipe' + port :
    'Port' + port;
  switch (error.code) {
    case 'EACCES':
      console.log(bind + 'requires elevated privleges');
      process.exit(1);
    case 'EADDRINUSE':
      console.log(bind + 'is already in use');
      process.exit(1);
    default:
      throw error;
  }
}

// listening事件
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ?
    'pipe' + addr :
    'port' + addr.port;
  debug('Listening on' + bind);
}