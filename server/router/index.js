// var dbserver = require('../dao/dbserver')
var rigister = require('../server/register')
var login = require('../server/login')
var search = require('../server/search')
var add = require('../server/add')
var userDetail = require('../server/userdetail')
var index = require('../server/index')
var friend = require('../server/friend')
var chat = require('../server/chat')

module.exports = function(app) {
  app.get('/test', (req, res) => {
    
  });

  // 注册
  app.post('/register/add', (req, res) => {
    rigister.register(req, res);
  });

  // 用户名或邮箱是否占用
  app.post('/register/judge', (req, res) => {
    rigister.judgeValue(req, res);
  });

  // 登录验证
  app.post('/login/match', (req, res) => {
    login.login(req, res);
  });
  
  //搜索用户
  app.post('/search/user', (req, res) => {
    search.searchUser(req, res);
  });
  //搜索好友
  app.post('/search/friend', (req, res) => {
    search.searchFriend(req, res);
  });

  // 添加用户
  app.post('/add/user', (req, res) => {
    add.addUser(req, res);
  });
  // 判断是否位好友
  app.post('/search/isfriend', (req, res) => {
    search.isFriend(req, res);
  });

  // 搜索群
  app.post('/search/group', (req, res) => {
    search.searchGroup(req, res);
  });
  // 判断是否在群内
  app.post('/search/isingroup', (req, res) => {
    search.isInGroup(req, res);
  });

  // 用户详情
  app.post('/user/detail', (req, res) => {
    userDetail.userDetail(req, res);
  });
  //用户信息修改
  app.post('/user/update', (req, res) => {
    userDetail.userUpdate(req, res);
  });

  //修改好友昵称
  // app.post('/user/markname', (req, res) => {
  //   userDetail.friendMarkName(req, res);
  // });

  // 好友操作
  // 申请好友
  app.post('/friend/applyfriend', (req, res) => {
    friend.applyFriend(req, res);
  })
  // 申请状态修改
  app.post('/friend/updatefriendstate', (req, res) => {
    friend.updateFriendState(req, res)
  })

  app.post('/friend/deletefriend', (req, res) => {
    friend.deleteFriend(req, res)
  })

  // 主页
  // 获取好哟列表
  app.post('/index/getfriend', (req, res) => {
    index.getFriend(req,res)
  })
  // 获取最后一条消息
  app.post('/index/getlastmsg', (req, res) => {
    index.getLastMsg(req, res);
  });
  // 获取好友未读消息数
  app.post('/index/unreadmsg', (req, res) => {
    index.unreadMsg(req, res)
  })

  // 好友消息标已读
  app.post('/index/updatemsg', (req, res) => {
    index.updateMsg(req, res)
  })

  // 获取群列表
  app.post('/index/getgroup', (req, res) => {
    index.getGroup(req,res)
  })
  // 获取最后一条qun消息
  app.post('/index/getlastgroupmsg', (req, res) => {
    index.getLastGroupMsg(req, res)
  })
  // qun消息标已读
  app.post('/index/updategroupmsg', (req, res) => {
    index.updateGroupMsg(req, res)
  })

  
  // 聊天页面
  // 获取消息
  app.post('/chat/msg', (req, res) => {
    chat.msg(req, res)
  })

  // token测试
  app.post('/login/test', (req, res) => {
    res.send('这里token正确');
  })


}

