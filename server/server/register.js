const dbserver = require('../dao/dbserver');

// 注册
exports.register = function(req, res) {
  let name = req.body.name;
  let mail = req.body.mail;
  let pwd = req.body.pwd;
  // res.send({name, mail, pwd});
  dbserver.buildUser(name, mail, pwd, res);
}

// 用户名 邮箱是否占用
exports.judgeValue = function(req, res) {
  let data = req.body.data;
  let type = req.body.type;
  // res.send({data, type});
  dbserver.countUserValue(data, type, res);
}