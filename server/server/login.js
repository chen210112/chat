const dbserver = require('../dao/dbserver')
// const jwt = require('../dao/jwt')

exports.login = function (req, res) {
  let data = req.body.data;
  let pwd = req.body.pwd;

  dbserver.userMatch(data, pwd, res);
}

//token测试
// exports.test = function (req, res) {
//   let token = req.body.token;
//   let jg = jwt.verifyToken(token);

//   res.send(jg)
// }