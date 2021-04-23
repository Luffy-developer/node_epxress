const connection = require('./db_conn');

var sqls = {
  // 登录检测
  login: 'select * from user where login_name = ? and password = ?',
  loginUser: 'select login_name, password from user where login_name = ?',
  users: 'select * from user',
  // 注册
  register: 'insert into user(login_name, password, create_time, flag) value(?, ?, ?, 1)',
  // 上传文件
  uploadFile: 'insert into upload value(?, ?, ?, ?, ?)',
  // 获取文件
  getFile: 'select ',
  // 重新上传文件
  updateFiles: 'update upload'
}

// 处理数据库中的数据
var conn_query = function (req, res, sql, params) {
  connection.query(sql, params, function (err, result) {
    if (err) {
      let errMsg = '';
      switch (err.errno) {
        case 1048:
          errMsg = '参数不能为空'
          break;
        case 1062:
          errMsg = '数据已存在'
          break;
        case 1265:
          errMsg = '格式错误'
          break;
        case 1327:
          errMsg = '参数不能为空'
          break;
        default:
          errMsg = '请求失败'
          break;
      }
      return res.json({
        code: err.errno,
        message: errMsg
      })
    } else {
      console.log('_conn', req.data);
      if (req.data) {
        return res.json({
          code: 200,
          message: '请求成功！',
          data: result
        })
      } else {
        console.log('token失败');
        return res.json({
          code: 1,
          status: 401,
          message: 'token验证失败'
        })
      }
    }
  })
}
// 通过post获取数据
var get_data_conn = function (req, res, sql, params, sub_sql, sub_params) {
  connection.query(sql, params, function (err, result) {
    if (err) {
      throw err;
    } else {
      // sasda
      if (req.data) {
        if (result.length == 0) {
          //删除当前最后一个 ，跳转前页
          params[0] = ((parseInt(sub_params[0]) - 1) - 1) * parseInt(sub_params[1]);
          sub_params[0] = parseInt(sub_params[0]) - 1
          get_data_conn(req, res, sql, params, sub_sql, sub_params)
        } else {
          connection.query(sub_sql, sub_params, function (error, among) {
            if (error) {
              console.log(error);

            } else {
              let total = among[0]['total'];
              return res.json({
                code: 200,
                message: 'success',
                data: result,
                paging: {
                  page_num: parseInt(sub_params[0]),
                  page_size: parseInt(sub_params[1]),
                  total: total
                }
              })
            }
            console.log(result)
          })
        }
      } else {
        //状态401返回  登录页面
        return res.json({
          code: 1,
          status: 401,
          message: 'token失效'
        })
      }
    }
  })
}

module.exports = {
  sqls,
  conn_query,
  get_data_conn
}