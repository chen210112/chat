// token
// 引入token
const jwt = require('jsonwebtoken')
const secret = "chat"

// 生成
exports.generateToken = function (e) {
  let payload = {id: e, time: new Date()};
  let token = jwt.sign(payload, secret, {expiresIn: 60 * 60 * 24 * 30});
  return token;
}

exports.verifyToken = function(e) {
  let payload;
  jwt.verify(e, secret, (err, result) => {
    if (err) {
      payload = 0;
    } else {
      payload = 1;
    }
  });
  return payload;
}