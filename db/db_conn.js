var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  port: ' 3306',
  user: 'root',
  password: 'root',
  database: 'user_login',
  connectTimeout: 5000,
  multipleStatements: false
})
connection.connect();

module.exports = connection