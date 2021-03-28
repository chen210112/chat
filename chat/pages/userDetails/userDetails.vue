<template>
	<view>
		<nav-bar class="my-nav-bar">
			<image slot="left" @tap="back" src="../../static/images/icon/back.png"></image>
			<span slot="center">用户信息</span>
		</nav-bar>
		<main class="main">
			<message-list class="my-message-list">
				<span slot="left" class="my-left">头像</span>
				<div slot="main" class="my-main" v-if="id===uid">
					<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
					<image :src="cropFilePath" @tap="upload"></image>
				</div>
				<div slot="main" class="my-main" v-else>
					<image :src="cropFilePath"></image>
				</div>
				<image slot="right" class="my-right" v-if="id===uid" src="../../static/images/icon/more2.png"></image>
			</message-list>
			<message-list class="my-message-list">
				<span slot="left" class="my-left">签名</span>
				<span slot="main" class="my-main">{{user.instroduce}}</span>
				<image slot="right" v-if="id===uid" @tap="modify('instroduce', '签名', '')" class="my-right" src="../../static/images/icon/more2.png"></image>
			</message-list>
			<message-list class="my-message-list">
				<span slot="left" class="my-left">注册</span>
				<span slot="main" class="my-main">{{changeTime(user.time)}}</span>
			</message-list>
			<message-list class="my-message-list">
				<span slot="left" class="my-left">用户名</span>
				<span slot="main" class="my-main">{{user.name}}</span>
				<image slot="right" v-if="id===uid" @tap="modify('name', '用户名', '')" class="my-right" src="../../static/images/icon/more2.png"></image>
			</message-list>
			<message-list class="my-message-list">
				<span slot="left" class="my-left">性别</span>
				<span slot="main" class="my-main" v-if="id===uid">
					 <picker @change="bindPickerChange" :value="index" :range="array">
						<view class="uni-input">{{user.sex}}</view>
					 </picker>
				</span>
				<span v-else slot="main" class="my-main">{{user.sex}}</span>
				<image slot="right" v-if="id===uid" class="my-right" src="../../static/images/icon/more2.png"></image>
			</message-list>
			<message-list class="my-message-list">
				<span slot="left" class="my-left">生日</span>
				<span slot="main" class="my-main" v-if="id===uid">
					 <picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
						<view class="uni-input">{{user.birth}}</view>
					</picker>
				</span>
				<span v-else slot="main" class="my-main">{{user.birth}}</span>
				<image slot="right" v-if="id===uid" class="my-right" src="../../static/images/icon/more2.png"></image>
			</message-list>
			<message-list class="my-message-list">
				<span slot="left" class="my-left">手机</span>
				<span slot="main" class="my-main">{{user.phone}}</span>
				<image slot="right" v-if="id===uid" @tap="modify('phone', '手机', '')" class="my-right" src="../../static/images/icon/more2.png"></image>
			</message-list>
			<message-list class="my-message-list">
				<span slot="left" class="my-left">邮箱</span>
				<span slot="main" class="my-main">{{user.email}}</span>
				<image slot="right" v-if="id===uid" @tap="modify('email', '邮箱', '')" class="my-right" src="../../static/images/icon/more2.png"></image>
			</message-list>
			<message-list class="my-message-list" v-if="id===uid">
				<span slot="left" class="my-left">密码</span>
				<span slot="main" class="my-main">******</span>
				<image slot="right" @tap="modify('psw', '修改密码', '', true)" class="my-right" src="../../static/images/icon/more2.png"></image>
			</message-list>
		</main>
		
		<footer>
			<span v-if="relation==='0'" @tap="quit">退出登录</span>
			<span v-if="relation==='1'" @tap="deleteFriend">删除好友</span>
		</footer>
		
		<!-- 弹出修改 -->
		<view class="modify" :style="{bottom:-+widHeight+'px'}" :animation="animationData">
			<nav-bar class="modify-header">
				<span slot="left" class="close" @tap="modify()">取消</span>
				<span slot="center" class="title">{{modifyTitle}}</span>
				<span slot="right" class="confirm" @tap="modifyConfirm">确定</span>
			</nav-bar>
			<div class="modify-main">
				<input type="password" v-show="ispwd" v-model="pwd" class="modify-pwd" placeholder="请输入原密码" placeholder-style="color:#aaa">
				<input v-if="type!=='psw'" v-model="data" class="modify-content" />
				<input v-if="type==='psw'" type="password" v-model="data" class="modify-content"/>
			</div>
		</view>
	</view>
</template>

<script>
	import NavBar from '../../components/common/navbar/NavBar.vue'
	import MessageList from '../../components/common/messagelist/MessageList.vue'
	import myfun from '../../commons/js/myfun.js'
	import ImageCropper from "../../components/ling-imgcropper/ling-imgcropper.vue"
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				id: '',
				relation: 0,
				
				uid: '',
				token: '',
				myname: '',
				
				user: {},
				
				array: ['男', '女'],
				index: -1,
				date: currentDate,
				headimg: '',
				tempFilePath: "",
				cropFilePath: "",
				// 原密码
				pwd: undefined,
				// 修改项
				type: '',
				
				ispwd: false,
				// 修改弹框的标题
				modifyTitle: '',
				data: '修改内容',
				// 动画
				animationData: {},
				isModify: false,
				// 页面高度
				widHeight: ''
			};
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		components: {
			NavBar,
			MessageList,
			ImageCropper
		},
		onLoad(e) {
			// 取到的是字符串
			this.id = e.id;
			this.relation = e.relation;
			this.getStorages();
			this.getUser();
		},
		onReady() {
			this.getElementStyle()
		},
		methods: {
			// 获取缓存数据
			getStorages() {
				try {
					const value = uni.getStorageSync('user')
					if (value) {
						this.uid = value.id;
						this.token = value.token;
						this.myname = value.name;
					} else {
						uni.navigateTo({
							url: '../login/login'
						});
					}
				} catch (e) {
					
				}
			},
			getUser() {
				uni.request({
					url: this.serverUrl + '/user/detail',
					data: {
						id: this.id,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						switch (status) {
							case 200:
								let res = data.data.result;
								// 处理头像链接
								this.cropFilePath = this.serverUrl + res.imgurl;
								console.log(this.cropFilePath)
								if (!res.instroduce) { res.instroduce = '这个人很懒，没有留下签名'}
								if (!res.sex) { res.sex = "无"}
								if (!res.birth) {
									res.birth = "无"
								} else {
									res.birth = this.changeTime(res.birth)
								}
								if (!res.phone) { res.phone = "无"}
								this.user = res;
								break;
							case 500:
								uni.showToast({
									title: '获取用户信息服务器出错',
									icon: 'none',
									duration: 1500
								});
								break;
							case 300: 
								// token过期
								uni.navigateTo({
									url: '../login/login'
								});
								break;
						}
					}
				})
			},
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 获取页面高度
			getElementStyle() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.modify').boundingClientRect(data => {
					this.widHeight = data.height;
					console.log(this.widHeight);
				}).exec();
			},
			// 修改项弹框
			modify(type,title, data, ispwd = false, pwd) {
				this.pwd = pwd;
				this.ispwd = ispwd;
				console.log(this.pwd);
				this.type = type;
				this.modifyTitle = title;
				this.data = data;
				this.isModify = !this.isModify;
				var animation = uni.createAnimation({
					duration: 100,
					timingFunction: 'ease',
				})
				
				if (this.isModify) {
					animation.bottom(0).step();
				} else {
					animation.bottom(-this.widHeight).step();
				}
				this.animationData = animation.export();
			},
			
			// 弹框修改确定
			modifyConfirm() {
				if (this.data.length > 0) {
					switch (this.type) {
						case 'email':
							// 判断邮箱格式
							let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
							if (reg.test(this.data)) {
								// 替换空格
								this.data = this.data.replace(/\s+/g,"");
								// 提交修改
								this.update(this.data, this.type, this.pwd);
							} else {
								uni.showToast({
									title: '邮箱格式错误',
									icon: 'none',
									duration: 1500
								});
							}
							break;
						case 'psw':
							if (this.data.length > 5) {
								if (this.pwd == null || this.pwd === '') {
									uni.showToast({
										title: '请输入原密码',
										icon: 'none',
										duration: 1500
									});
								} else {
									// 提交修改
									this.update(this.data, this.type, this.pwd);
								} 
									
							} else {
								uni.showToast({
									title: '密码至少6位',
									icon: 'none',
									duration: 1500
								});
							}
							break;
						default:
							// 替换空格
							this.data = this.data.replace(/\s+/g,"");
							if (this.data.length > 0) {
								// 提交修改
								this.update(this.data, this.type, this.pwd);
							} else {
								uni.showToast({
									title: '请不要输入空格',
									icon: 'none',
									duration:1500
								})
							}
							break;
					}
				} else {
					uni.showToast({
						title: '请输入内容',
						icon: 'none',
						duration:1500
					})
				}
			},
			// 时间转换
			changeTime(date) {
				return myfun.detailTime(date);
			},
			// 性别选择器
			bindPickerChange(e) {
				let oldIndex = this.index;
				this.index = e.target.value;
				if (this.index != oldIndex) {
					let sex = '';
					if (this.index === 0) {
						sex = '男';   // male 
					} else if (this.index === 1) {
						sex = '女';
					}
					// 提交服务器修改
					this.update(sex, 'sex');
				}
				
			},
			// 日期选择器
			bindDateChange: function(e) {
				let oldDate = this.date;
				this.date = e.target.value;
				if (this.date != oldDate) {
					this.update(this.date, 'birth');
				}
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
	
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			// 头像裁剪
			upload() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: (res) => {
						this.tempFilePath = res.tempFilePaths.shift()
					}
				});
			},
			confirm(e) {
			  this.tempFilePath = "";
			  this.cropFilePath = e.detail.tempFilePath;
			  this.headimg = e.detail.tempFilePath;
			  
			  // 除了H5端返回base64数据外，其他端都是返回临时地址，所以你要判断base64还是临时文件名，（用条件编译APP-PLUS||MP执行编译。）
			  // 按我这里是先上传裁剪得来的临时文件地址然后得到临时文件名，
			  // 待活你要判断是H5还是其他端传给后端类型参数让后端判断执行何种情况代码就OK了
		
			  uni.uploadFile({
				url: this.serverUrl + "/files/upload",
				filePath: this.headimg,
				name: "file",
				fileType: "image",
				//传递参数
				formData:{
					url: 'user',
					name: this.uid,
					token: this.token
				},
				success: (uploadFileRes) => {
				  var backstr = uploadFileRes.data;
				  console.log(backstr);
				  // 本地存储用户信息修改
				  try {
				  	uni.setStorageSync('user', {'id': this.uid, 'name': this.myname, 'imgurl': backstr, 'token': this.token})
				  	
				  } catch(e) {
				  	console.log('数据存储错误')
				  }
				  // 修改头像保存到数据库
				  this.update(backstr, 'imgurl')
				},
				complete() {
					// 
				},
				fail(e) {
				  console.log("this is errormes " + e.message);
				}
			  });
			  // #endif
			},
			cancel() {
			  console.log("canceled");
			  this.tempFilePath = "";
			},
			// 修改数据
			update(e, type, pwd) {
				uni.request({
					url: this.serverUrl + '/user/update',
					data: {
						id: this.uid,
						data: e,
						type,
						pwd,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						switch (status) {
							case 200: 
								if (type !== 'psw') {
									this.user[type] = e;
								} else {
									// 清除缓存
									uni.removeStorage({
										key: 'user',
										success: function (res) {
											console.log('success');
										}
									});
									// 用户需要重新登录
									uni.showToast({
										title: '修改成功，即将退出当前账户',
										duration: 1500
									});
									setTimeout(() => {
										uni.reLaunch({
											url: '../login/login'
										});
									}, 2000);
									break;
								}
								if (type !== 'imgurl' && type !== 'sex' && type !== 'birth' ) {
									this.modify();
								}
								break;
							case 500:
								uni.showToast({
									title: '服务器出错',
									icon: 'none',
									duration: 1500
								});
								break;
							case 400: 
								uni.showToast({
									title: '原密码错误',
									icon: 'none',
									duration: 1500
								});
								break;
							case 300:
							// token过期
								uni.reLaunch({
									url:'../login/login'
								});
								break;
							case 304: 
								uni.showToast({
									title: '已被占用',
									icon: 'none',
									duration: 1500
								});
								break;
						}
					}
				})
			},
			// 退出登录
			quit() {
				uni.removeStorage({
					key: 'user',
					success: function (res) {
						console.log('success');
					}
				});
				uni.reLaunch({
					url: '../login/login'
				});
			},
			// 删除好友
			deleteFriend() {
				uni.showModal({
					title: '提示',
					content: '确定删除好友吗？',
					success: res => {
						if (res.confirm) {
							uni.request({
								url: this.serverUrl + '/friend/deletefriend',
								data: {
									uid: this.uid,
									fid: this.id,
									token: this.token
								},
								method: 'POST',
								success: (data) => {
									let status = data.data.status;
									switch (status) {
										case 200: 
											// 删除成功
											uni.reLaunch({
												url:'../index/index'
											});
											break;
										case 500:
											uni.showToast({
												title: '服务器出错',
												icon: 'none',
												duration: 1500
											});
											break;
										case 300: 
											uni.reLaunch({
												url:'../login/login'
											});
											break;
									}
								}
							});
						} else if (res.cancel) {
							// 取消
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.my-nav-bar {
		image {
			width: 25px;
			height: 25px;
			vertical-align: middle;
		}
		span {
			font-weight: 550;
			font-size: 18px;
			vertical-align: middle;
		}
	}
	.main {
		border-bottom: 1px solid rgba(1,1,1,.1);
		padding-top: 108rpx;
		// border: solid red;
		// top: 0;
		// bottom: 0;
		.my-message-list {
			padding: 4px 23px;
			&:active {
				background-color: transparent;
			}
			.my-left {
				vertical-align: middle;
			}
			.my-main {
				color: grey;
				image {
					width: 96rpx;
					height: 96rpx;
					border-radius: 12rpx;
				}
			}
			.my-right {
				width: 40rpx;
				height: 40rpx;
				border-radius: 12rpx;
				vertical-align: middle;
			}
		}
	}
	
	footer {
		text-align: center;
		color: red;
		padding-top: 28px;
	}
	
	.modify {
		border: solid;
		position: fixed;
		// position: relative;
		z-index: 99;
		// top: 0;
		left: 0;
		right: 0;
		height: 100%;
		background-color: #fff;
		.modify-header {
			position: absolute;
			.close {
				vertical-align: middle;
			}
			.title {
				font-size: 25px;
				vertical-align: middle;
			}
			.confirm {
				color: $uni-color-success;
				vertical-align: middle;
			}
		}
		.modify-main {
			padding-top: 118rpx;
			.modify-pwd,
			.modify-content {
				width: 85%;
				margin: 10px auto;
				padding: 10px;
				background: $uni-bg-color-grey;
				border-radius: 10px;
			}			
		}
	}
</style>
