var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/social', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('数据库social连接成功');
});

module.exports = db;