var express = require('express');
var router = express.Router();
var sqlObj = require('../db/sql');
var connection = require('../db/db_conn');
var crypto = require('crypto');

// 引入token
var vertoken = require('../token/token');

router.get('/login', function (req, res) {
  const params = [];
  params[0] = req.body.loginName
  params[1] = req.body.password
  console.log(params);
  if (params[0] == '' || params[1] == '') {
    return res.json({
      code: 1,
      message: '账户或密码不能为空'
    })
  } else {
    connection.query(sqlObj.sqls.login, params, function (err, result) {
      if (err) {
        throw err;
      } else {
        if (result.length != 0) {
          vertoken.setToken(result[0].login_name, result[0].id)
            .then(data => {
              return res.json({
                code: 200,
                message: '登录成功',
                token: data
              })
            })
        } else {
          connection.query(sqlObj.sqls.users, function (err, data) {
            if (err) {
              throw err;
            } else {
              const login_params = [req.body.loginName]
              connection.query(sqlObj.sqls.loginUser, login_params, function (err, data) {
                if (data.length == 0) {
                  return res.json({
                    code: 1,
                    status: 200,
                    message: '用户不存在'
                  })
                } else {
                  if (req.body.loginName !== data[0].login_name || req.body.password !== data[0].password) {
                    return res.json({
                      code: 1,
                      result: 0,
                      status: 200,
                      message: '用户名或密码错误'
                    })
                  } else {
                    return res.json({
                      code: 1,
                      result: 0,
                      status: 400,
                      message: '系统错误'
                    })
                  }
                }
              })
            }
          })
        }
      }
    })
  }
})

router.post('/register', function (req, res) {
  const params = [];
  params[0] = req.body.loginName
  params[1] = crypto.createHash('md5').update(req.body.password).digest("hex")
  params[2] = new Date()
  console.log(params);
  if (params[0] === '' || params[1] === '') {
    return res.json({
      code: 1,
      message: '用户名或密码不能为空'
    })
  } else {
    connection.query(sqlObj.sqls.users, function (err, result) {
      if (err) {
        throw err;
      } else {
        // 判断用户名是否存在
        const users = [];
        result.some((item) => {
          users.push(item.login_name);
        })
        if (users.includes(params[0])) {
          return res.json({
            code: 1,
            message: '用户已经存在'
          })
        } else {
          connection.query(sqlObj.sqls.register, params, function (err, data) {
            if (err) {
              throw err
            } else {
              return res.json({
                code: 200,
                message: '注册成功'
              })
            }
          })
        }
      }
    })
  }
})

module.exports = router