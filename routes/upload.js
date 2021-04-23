// 引入模块
var express = require('express');
var router = express.Router();
const multer = require('multer');
var sqlObj = require('../db/sql');

// 验证失效公共方法
var common = function (res) {
  return res.json({
    code: 1,
    status: 401,
    message: 'token失效'
  })
}

// 图片上传
var storage = multer.diskStorage({
  // 设置上传文件夹
  destination: function (req, file, cd) {
    cd(null, './public/files')  // 根目录
  },
  filename: function (req, file, cd) {
    // 设置图片的名称
    cd(null, `${Date.now()}-${file.originalname}`)
  }
})

var upload = multer({ storage: storage });

// 上传图片
router.post('/api/uploadFile', upload.any(), function (req, res, next) {
  const url = `http://${req.headers.host}/files/${req.files[0].filename}`
  if (!req.files) {
    return res.json({
      code: 1,
      message: '上传失败'
    })
  } else {
    return res.json({
      code: 200,
      message: '上传成功',
      url: url
    })
  }
})
// 获取图片
router.post('/api/getFile', function (req, res, next) {
  if(req.data != undefined) {
    const params = [req.data.user_id]
    sqlObj.conn_query(req, res, sqlObj.sqls.getFile, params)
  } else {
    common(res)
  }
})

// 上传至数据库
router.post('/api/insertDatabase', function (req, res, next) {
  if(req.data != undefined) {
    const url = `http://${req.headers.host}/files/${req.files[0].filename}`
    const params = [req.data.user_id, req.body.file_name, url]
    sqlObj.conn_query(req, res, sqlObj.sqls.updateFiles, params)
  }
})

module.exports = router