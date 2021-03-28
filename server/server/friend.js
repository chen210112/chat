var dbserver = require('../dao/dbserver')

exports.applyFriend = function(req, res) {
  let data  = req.body;
  dbserver.applyFriend(data, res);
}

// 更新好友状态
exports.updateFriendState = function(req, res) {
  let data = req.body;
  dbserver.updateFriendState(data, res);
}

exports.deleteFriend = function(req, res) {
  let data = req.body;
  dbserver.deleteFriend(data, res);
}

