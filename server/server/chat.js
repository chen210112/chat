const dbserver = require('../dao/dbserver')
// 获取yi对一聊天消息
exports.msg = function(req, res) {
  let data  = req.body
  
  dbserver.msg(data, res)
}