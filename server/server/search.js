const dbserver = require('../dao/dbserver')

exports.searchUser = function(req, res) {
  let data = req.body.data;
  dbserver.searchUser(data, res);
}

exports.searchFriend = function(req, res) {
  let data = req.body;
  dbserver.getUsers(data, res);
}

exports.isFriend = function(req, res) {
  let uid = req.body.uid;
  let fid = req.body.fid;
  dbserver.isFriend(uid, fid, res);
}

exports.searchGroup = function(req, res) {
  let data = req.body.data;
  dbserver.searchGroup(data, res);
}

exports.isInGroup = function(req, res) {
  let uid = req.body.uid;
  let gid = req.body.gid;
  dbserver.isInGroup(uid, gid, res);
}
