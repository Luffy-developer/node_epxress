var express = require('express');
var router = express.Router();
var sqlObj = require('../db/sql')

/* GET home page. */
// router.post('/api/getAll', function (req, res, next) {
//   const sub_params = [];
//   sub_params[0] = req.body.page_num;
//   sub_params[1] = req.body.page_size;
//   const params = [(parseInt(sub_params[0]) - 1) * parseInt(sub_params[1]), parseInt(sub_params[1])];
//   sqlObj.get_data_conn(req, res, sqlObj.sqls.websites, params, sqlObj.sqls.webCount, sub_params)
// })

// router.post('./api/addWebsite', function (req, res, next) {
//   const params = [req.body.name, req.body.url, req.body.alexa, req.body.country];
//   sqlObj.conn_query(req, res, sqlObj.sqls.addWebsite, params)
// })
module.exports = router;