const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('./dao/jwt')

const app = express()
const port = 3000

// socket.io
var server = app.listen(3002);
var io = require('socket.io').listen(server);
require('./dao/socket')(io)

app.get('/', (req, res) => res.send('hello wrld'))

// 跨域
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');  
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', '3.2.1')
  res.header('Content-Type', 'application/json;charset=utf-8');
  
  if (req.method == 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true}))
app.use(bodyParser.json())

// 获取静态目录路径
app.use(express.static(__dirname + '/data'))

// token判断
app.use((req, res, next) => {
  if (typeof(req.body.token) != 'undefined') {
    let token = req.body.token;
    let tokenMatch = jwt.verifyToken(token);
    if (tokenMatch == 1) {
      // 通过验证
      next();
    } else {
      res.send({status: 300});
    }
  } else {
    next();
  }
})

require('./router/index')(app)
require('./router/files')(app)

// 404
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
})

// 出现错误处理
app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.send(err.message);
})

app.listen(port, () => console.log('running 3000'))