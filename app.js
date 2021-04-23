var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');

var vertoken = require('./token/token');
var expressJwt = require('express-jwt');

var app = express();

// 日志
var log = require('./logs/log');
log.use(app);

// 设置跨域
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", "3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  res.header("Access-Control-Allow-Headers", "content-type,Authorization,X-Requested-With");
  next();
})

// 解析token获取用户信息
app.use(function (req, res, next) {
  var token = req.headers['authorization'];
  if (token === undefined) {
    return next();
  } else {
    vertoken.getToken(token).then(data => {
      req.data = data;
      return next();
    }).catch((err) => {
      return next();
    })
  }
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());

// 直接访问静态资源
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', usersRouter);
// app.use('/login', logRouter);

// 验证token是否过期并规定那些路由不需要验证
app.use(expressJwt({
  secret: 'first_token',
  algorithms: ['HS256']
}).unless({
  path: ['/login', '/register']
}))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// token失效返回信息
app.use(function (err, req, res, next) {
  if (err.status === 401) {
    return res.json({
      code: 1,
      message: 'token失效',
      status: 401
    })
  }
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;