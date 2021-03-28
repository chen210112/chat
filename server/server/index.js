const dbserver = require('../dao/dbserver')
// 获取好友列表
exports.getFriend = function(req, res) {
  let data  = req.body
  
  dbserver.getUsers(data, res)
}

// 获取最后一条消息
exports.getLastMsg = function(req, res) {
  let data = req.body;
  dbserver.getOneMsg(data, res);
}

// 获取未读消息数
exports.unreadMsg = function(req, res) {
  // console.log('unread server');
  let data = req.body;
  dbserver.unreadMsg(data, res)
}
// 好友消息标已读
exports.updateMsg = function(req, res) {
  let data = req.body
  dbserver.updateMsg(data, res)
}
// 获取群列表
exports.getGroup = function(req, res) {
  let uid = req.body.uid
  dbserver.getGroup(uid, res)
}
// 获取追后一条群消息
// 好气，原来是这里函数名写成了getLastMsg覆盖了上面的
exports.getLastGroupMsg = function(req, res) {
  let gid = req.body.gid
  dbserver.getOneGroupMsg(gid, res)
}

// 群消息标已读
exports.updateGroupMsg = function(req, res) {
  let data = req.body
  dbserver.updataGroupMsg(data, res)
}