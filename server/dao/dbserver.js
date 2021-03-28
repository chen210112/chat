// 与数据库对接  增删改

var dbmodel = require('../model/dbmodel')
var User = dbmodel.model('User')
var Friend = dbmodel.model('Friend')
var Group= dbmodel.model('Group')
var GroupUser= dbmodel.model('GroupUser')
var Message = dbmodel.model('Message')
var GroupMsg = dbmodel.model('GroupMsg')
// jia mi
var bcrypt = require('../dao/bcrypt')
var jwt = require('../dao/jwt')

//create user
exports.buildUser = function(name, email, pwd, res) {
  //密码 jia mi
  let password = bcrypt.encryption(pwd);

  let data = {
    name: name,
    email: email,
    psw: password,
    time: new Date()
  }

  let user = new User(data);
  user.save((err, result) => {
    // 反馈注册是否成功
    if (err) {
      res.send({status:500});
      // res.sendStatus(500);
    } else {
      res.send({status:200});
      // res.sendStatus(200);
    }
  })
} 

// 计算用户表(集合）对象（文档）匹配某个键值对的个数
exports.countUserValue = function(data, type, res) {
  let whereStr = {};
  whereStr[type] = data;

  User.countDocuments(whereStr, function(err, count) {
    if (err) {
      res.send({status:500});
      // res.sendStatus(500);
    } else {
      res.send({status:200, count});
      // res.status(200).send(result);
    }
  })
}

// 用户验证
exports.userMatch = function (data, pwd, res) {
  let whereStr = {$or: [{'name':data}, {'email':data}]};
  let out = {'name':1, 'imgurl':1, 'psw':1};

  User.find(whereStr, out, function (err, result) {
    if (err) {
      res.send({status: 500});
    } else if (result == ''){
      res.send({status: 400});
    } else {
      result.map(function(obj) {
        const pwdMatch = bcrypt.verification(pwd, obj.psw);
        if (pwdMatch) {
          let token = jwt.generateToken(obj._id);
          let back = {
            id: obj._id,
            name: obj.name,
            imgurl: obj.imgurl,
            token: token
          }
          res.send({status:200, back});
        } else {
          res.send({status: 400});
        }
      })
    }
    
  })
}


// 搜索用户 模糊搜索
exports.searchUser = function(data, res) {
  // console.log('nnn');
  let whereStr = {$or:[{'name' : {$regex : data}},{'email' : {$regex: data}}]};
  let out = {
    'name': 1,
    'email': 1,
    'imgurl': 1
  };
  User.find(whereStr, out, (err, result) => {
    if (err) {
      console.log(err);
      res.send({status: 500});
    } else {
      res.send({status: 200, result});
    }
  });
}
// 搜索用户 精准搜索
exports.addUser = function(data, res) {
  let whereStr = {$or:[{'name' : data},{'email' : data}]};
  let out = {
    'name': 1,
    'email': 1,
    'imgurl': 1
  };
  User.find(whereStr, out, (err, result) => {
    if (err) {
      console.log(err);
      res.send({status: 500});
    } else {
      res.send({status: 200, result});
    }
  });
}

// 判断是否位好友
exports.isFriend = function(uid, fid, res) {
  
  // uid = Number(uid)
  // fid = Number(fid)
  // console.log(typeof uid)

  let whereStr = {'userID':uid, 'friendID':fid, 'state':0}
 
  Friend.findOne(whereStr, (err, result) => {
    if (err) {
      return res.send({status: 500});
    } 
    console.log(result)
    if (result) {
      res.send({status: 200});
    } else {
      res.send({status: 400});
    }
  })
}

//搜索群
exports.searchGroup = function(data, res) {
  let whereStr = {'name' : {$regx : data}};
  let out = {
    'name': 1,
    'imgurl': 1
  }
  Group.find(whereStr, out, (err, result) => {
    if (err) {
      res.send({status: 500});
    } else {
      res.send({status: 200, result});
    }
  })
}

//判断是否在群内
exports.isInGroup = function(uid, gid, res) {
  let whereStr = {'userId':uid, 'groupID':gid}

  GroupUser.findOne(whereStr, (err, result) => {
    if (err) {
      return res.send({status: 500});
    } 
    if (result) {
      res.send({status: 200});
    } else {
      res.send({status: 400});
    }
  })
}

// 用户详情
exports.userDetail = function(id, res) {
  let whereStr = {'_id': id};
  let out = {'psw': 0};
  User.findOne(whereStr, out, (err, result) => {
    if (err) {
      res.send({status: 500});
    } else {
      res.send({status: 200, result});
    }
  })
}

// y用户xinxi修改
function update(data, update, res) {
  User.findByIdAndUpdate(data, update, (err, result) => {
    if (err) {
      res.send({status: 500});
    } else {
      res.send({status: 200});
    }
  })
}

exports.userUpdate = function(data, res) {
  let updateStr ={}

  // 判断是否有密码
  if (data.pwd != undefined ) {
    User.find({'_id': data.id}, {'psw': 1}, (err, result) => {
      if (err) {
        return res.send({status: 500});
      } 
      if (result == '') {
        res.send({status: 400});
      } else {
        result.map((e) => {
          const pwdMatch = bcrypt.verification(data.pwd, e.psw);
          if (pwdMatch) {
            // 密码验证成功
            // 如果为修改密码先加密
            if (data.type == 'psw') {
              let password = bcrypt.encryption(data.data);
              updateStr[data.type] = password;
              update(data.id, updateStr, res);
            } else {
              // 邮箱匹配
              updateStr[data.type] = data.data;
              User.countDocuments(updateStr, (err, result) => {
                if (err) {
                  res.send({status: 500});
                } else {
                  if (result == 0) {
                    update(data.id, updateStr, res);
                  } else {
                    res.send({status: 304});
                  }
                }
              })
            }
            
          } else {
            // 密码匹配失败
            res.send({status: 400});
          }
        })
      }
    })
  } else if (data.type === 'name' || data.type === 'email') {
    // 如果是用户名先进行匹配
    updateStr[data.type] = data.data;
    User.countDocuments(updateStr, (err, result) => {
      if (err) {
        res.send({status: 500});
      } else {
        if (result == 0) {
          update(data.id, updateStr, res);
        } else {
          // 已存在用户名或邮箱
          res.send({status: 304});
        }
      }
    })
  } else {
    // 一般项目修改
    updateStr[data.type] = data.data;
    update(data.id, updateStr, res);
  }
}

// // 修改好友昵称
// exports.friendMarkName = function(data, res) {
//   let whereStr = {'userID': data.uid, 'friendID': data.fid};
//   let updateStr = {'markname': data.name};
//   Friend.updateOne(whereStr, updateStr, (err, result) => {
//     if (err) {
//       res.send({status: 500});
//     } else {
//       res.send({status: 200});
//     }
//   })
// }

// 好友操作
// 添加好友表
exports.buildFriend = function(uid, fid, state) {
  let data = {
    userID: uid,
    friendID: fid,
    state,
    time: new Date(),
    lastTime: new Date()
  }

  let friend = new Friend(data);

  friend.save((err, result) => {
    if (err) {
      // res.send({status: 500});
      console.log('申请好友出错');
    } else {
      // res.send({status: 200});
    }
  })
}

//好友最后通讯时间
exports.upFriendLastTime = function(data) {
  let whereStr = {$or:[{'userID': data.uid, 'friendID': data.fid}, {'userID': data.fid, 'friendID': data.uid}]};
  let updateStr = {'lastTime': new Date()};

  Friend.updateMany(whereStr, updateStr, (err, result) => {
    if (err) {
      // res.send({status: 500});
      console.log('好友最后通讯时间更新出错');
    } else {
      // res.send({status: 200});
    }
  })
}

// 添加一对一消息
exports.insertMsg = function(uid, fid, msg, type, res) {
  let data = {
    userID: uid,
    friendID: fid,
    message: msg,
    types: type,
    time: new Date(),
    state: 1
  }
  let message = new Message(data);

  message.save((err, result) => {
    if (err) {
      res.send({status: 500});
    } else {
      res.send({status: 200});
    }
  })
}

// 好友申请
exports.applyFriend = function(data, res) {
  let whereStr = {'userID': data.uid, 'friendID': data.fid};
  Friend.countDocuments(whereStr, (err, result) => {
    if (err) {
      return res.send({status: 500});
    }
    if (result === 0) {
      this.buildFriend(data.uid, data.fid, 2);
      this.buildFriend(data.fid, data.uid, 1);
    } else {
      // 已尽申请好友
      this.upFriendLastTime(data);
    }
    // 添加消息
    this.insertMsg(data.uid, data.fid, data.msg, 0, res)
  })
}

// 更新好友状态
exports.updateFriendState = function(data, res) {
  let whereStr = {$or:[{'userID':data.uid, 'friendID':data.fid},{'userID':data.fid,'friendID':data.uid}]}

  Friend.updateMany(whereStr, {'state': 0}, (err, result) => {
    if (err) {
      res.send({status: 500});
    } else {
      res.send({status: 200});
    }
  })
}

// 拒绝好友或删除好友
exports.deleteFriend = function(data, res) {
  let whereStr = {$or:[{'userID':data.uid, 'friendID':data.fid}, {'userID':data.fid, 'friendID':data.uid}]}
  Friend.deleteMany(whereStr, (err, result) => {
    if (err) {
      res.send({status: 500})
    } else{
      res.send({status: 200})
    }
  })
}


// 按要求获取用户列表
exports.getUsers = function(data, res) {
  // console.log(data);
  let query = Friend.find({});
  // 查询条件
  query.where({'userID': data.uid, 'state': data.state});
  // 查找FriendID 关联的user对象
  query.populate('friendID');
  // 排序方式 
  query.sort({'lastTime': -1});
  // 查询结果
  query.exec().then((e) => {
    let result = e.map((ver) => {
      return {
        id: ver.friendID._id,
        name: ver.friendID.name,
        imgurl: ver.friendID.imgurl,
        lastTime: ver.lastTime,
        type: 0
      }
    })
    res.send({status: 200, result});
  }).catch(err => {
    res.send({status: 500});
  })
}

// 按要求获取一对一消息
exports.getOneMsg = function(data, res) {
  let query = Message.findOne({});
  query.where({$or: [{'userID': data.uid, 'friendID': data.fid}, {'userID': data.fid, 'friendID': data.uid}]});
  
  // 排序方式 
  query.sort({'time': -1})
  // 查询结果
  query.exec().then((ver) => {
      let result =  {
        message: ver.message,
        time: ver.time,
        types: ver.types
      }
      res.send({status: 200, result})
  }).catch(err => {
    res.send({status: 500})
  })
}

// huizong一对一消息未读素
exports.unreadMsg = function(data, res) {
  let whereStr = {'userID': data.uid, 'friendID': data.fid, state: 1};
  // console.log('unread dbserver');
  Message.countDocuments(whereStr, (err, result) => {
    if (err) {
      res.send({status: 500})
    } else {
      res.send({status: 200, result})
    }
  })
}
// xiugai一对一消息zhuangtai
exports.updateMsg = function(data, res) {
  let whereStr = {'userID': data.uid, 'friendID': data.fid, 'state': 1}

  let updateStr = {'state': 0}

  Message.updateMany(whereStr, updateStr, (err, result) => {
    if (err) {
      res.send({status: 500})
    } else {
      res.send({status: 200})
    }
  })

}
// an要求获取群列表
exports.getGroup = function(uid, res) {
  let query = GroupUser.find({})
  // 查询条件
  query.where({'userID': uid})
  // 
  query.populate('groupID')
  // 排序方式 
  query.sort({'lastTime': -1})
  // 查询结果
  query.exec().then( e => {
    let result = e.map( ver => {
      return {
        id: ver.groupID._id,
        name: ver.groupID.name,
        markname: ver.name,
        imgurl: ver.groupID.imgurl,
        lastTime: ver.lastTime,
        tip: ver.tip,
        type: 1
      }
    })
      res.send({status: 200, result})
  }).catch(err => {
    res.send({status: 500})
  })
}

// 按要求获取群消息
exports.getOneGroupMsg = function(data, res) {
  let query = GroupMsg.findOne({})

  query.where({'groupID': gid})
  query.populate('userID')
  // 排序方式 
  query.sort({'time': -1})
  // 查询结果
  query.exec().then((ver) => {
      let result =  {
        message: ver.message,
        time: ver.time,
        types: ver.types,
        name: ver.userId.name
      }
      res.send({status: 200, result})
  }).catch(err => {
    res.send({status: 500})
  })
}
// 群消息数修改
exports.updateGroupMsg = function(data, res) {
  let whereStr = {'userID': data.uid, 'groupID': data.gid}

  let updateStr = {'tip': 0}

  Message.updateOne(whereStr, updateStr, (err, result) => {
    if (err) {
      res.send({status: 500})
    } else {
      res.send({status: 200})
    }
  })

}


// 消息操作
// 分页获取聊天消息
exports.msg = function(data, res) {
  var skipNum = (data.nowPage - 1) * data.pageSize; 
  let whereStr = {$or: [{'userID': data.uid, 'friendID': data.fid}, {'userID': data.fid, 'friendID': data.uid}]};
  let sort = {'time': -1};

  Message.find(whereStr).skip(skipNum).limit(data.pageSize).sort(sort).populate('userID').exec((err, docs) => {
    if (err) {
      return res.send({status: 500});
    }
    let result = docs.map(ver => {
      return {
        id: ver._id,
        message: ver.message,
        types: ver.types,
        time: ver.time,
        fromId: ver.userID._id,
        imgurl: ver.userID.imgurl
      };
    });
    res.send({status: 200, result});
  });

}
