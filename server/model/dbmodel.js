var mongoose = require('mongoose')
var db = require('../config/db')

var Schema = mongoose.Schema;

// 用户表
var UserSchema = new Schema({
  name: {type: String},                   //用户名
  psw: {type: String},                    //密码
  email: {type: String},                  //邮箱
  sex: {type: String, default: ''},       //性别
  birth: {type: Date},                    //生日
  phone: {type: Number},                  //电话
  instroduce: {type: String},             //介绍
  imgurl: {type: String, default: '/user/user.png'}, //用户头像
  time: {type: Date}                  //注册时间    
});
// 好友表
var FriendSchema = new Schema({
  userID: {type: Schema.Types.ObjectId, ref: 'User'},   //用户id
  friendID: {type: Schema.Types.ObjectId, ref: 'User'}, //好友id
  state: {type: String},          //好友状态（0为好友，1申请中，2申请发送方，对方未同意
  time: {type: Date},         //成为好友时间
  lastTime: {type: Date}      //最后通讯时间
});

// 好友消息表
var MessageSchema = new Schema({
  userID: {type: Schema.Types.ObjectId, ref: 'User'},   //用户id
  friendID: {type: Schema.Types.ObjectId, ref: 'User'}, //好友id
  message: {type: String},          //内容
  types: {type: String},     //内容类型（0文字 1图片连接 2音频连接）
  time: {type: Date},         //发送时间
  state: {type: Number}      //消息状态（0已读 1未读）
})

// 群表
var GroupSchema = new Schema({
  userID: {type: Schema.Types.ObjectId, ref: 'User'},   //用户id
  name: {type: String},          //群名
  imgurl: {type: String, default: '/group/group.png'},     //群头像
  time: {type: Date},         //创建时间
  notice: {type: String}      //公告
})

// 群成员表
var GroupUserSchema = new Schema({
  groupID: {type: Schema.Types.ObjectId, ref: 'Group'},   //群id
  userID: {type: Schema.Types.ObjectId, ref: 'User'},
  name: {type: String},          //群内名称
  tip: {type: Number, default: 0},   //未读消息数
  time: {type: Date},         //加入时间
  lastTime: {type: Date},     //zui后通讯时间
  shield: {type: Number}      //是否屏蔽群笑死
})

// 群消息表
var GroupMsgSchema = new Schema({
  groupID: {type: Schema.Types.ObjectId, ref: 'Group'},   //群id
  userID: {type: Schema.Types.ObjectId, ref: 'User'},
  message: {type: String},          //内容
  types: {type: String},     //内容类型（0文字 1图片连接 2音频连接）
  time: {type: Date}        //发送时间

})



module.exports = db.model('User', UserSchema);
module.exports = db.model('Friend', FriendSchema);
module.exports = db.model('Message', MessageSchema);
module.exports = db.model('Group', GroupSchema);
module.exports = db.model('GroupUser', GroupUserSchema);
module.exports = db.model('GroupMsg', GroupMsgSchema);
