module.exports = function(io) {
   // socket注册用户
   var users = {};

    io.on('connection', (socket) => {
   
    // 用户登录注册
    socket.on('login', id => {
      console.log(socket.id);
      socket.name = id;
      users[id] = socket.id;
      // 回复自己的客户端
      socket.emit('login', socket.id)
      
    });

    // 接收客户端发送过来的一对一消息
    socket.on('msg', (msg, fromid, toid) => {
      console.log(msg);
      // 发送给对方
      socket.to(users[toid]).emit('msg', msg, fromid);
    });

    // 用户离开
    socket.on('disconnecting', () => {
      if (users.hasOwnProperty(socket.name)) {
        delete users[socket.name];
        console.log(socket.id + '离开');  
      }
      
    });

  });
}