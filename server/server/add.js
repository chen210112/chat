var dbserver = require('../dao/dbserver')

exports.addUser = function(req, res) {
  let data  = req.body.data;
  dbserver.addUser(data, res);
}
