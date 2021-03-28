const bcrypt = require('bcryptjs')

// hash密码
exports.encryption = function(data) {
  // 随机
  let salt = bcrypt.genSaltSync(10);

  // hash
  let hash = bcrypt.hashSync(data, salt);

  return hash;
}

// jie mi
exports.verification = function (data, hash) {
  let verif = bcrypt.compareSync(data, hash);

  return verif;
}