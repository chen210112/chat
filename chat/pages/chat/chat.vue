<template>
	<view class="content">
		<nav-bar class="my-nav-bar">
			<image slot="left" src="../../static/images/icon/back.png" @tap="back"></image>
			<span slot="center">{{fname}}</span>
			<image slot="right" v-if="type==1" :src="fimgurl"></image>
		</nav-bar>
		
		<scroll-view class="chat" scroll-y="true" :scroll-with-animation="swanition" :scroll-into-view="scrollToView" @scrolltoupper="nextPage">
			<div class="chat-main" :style="{paddingBottom: inputH + 'px'}">
				<div class="loading" :class="{notDisplay: isloading}">
					<image src="../../static/images/icon/loading.png" class="loading-img" :animation="animationData"></image>
				</div>
				<div class="chat-every" v-for="(item,index) in msgs" :key="index" :id="'msg' + item.id">
					<div class="chat-time" v-if="item.time != ''">{{changeTime(item.time)}}</div>
					<!-- 对方 -->
					<div v-if="item.fromId !== uid" class="msg-m msg-left">
						<image :src="item.imgurl" class="user-img"></image>
						<div class="message">
							<!-- 文字 -->
							<div class="msg-text" v-if="item.types == 0">{{item.message}}</div>
							<!-- 图片 -->
							<image class="msg-img" mode="widthFix" :src="item.message" 
							v-if="item.types == 1" @tap="previewImg(item.message)"></image>
							
							<!-- 位置 -->
							<div v-if="item.types==3" class="msg-text">
								{{item.message.name}}
							</div>
						</div>
					</div>
					<!-- 我 -->
					<div v-if="item.fromId == uid" class="msg-m msg-right">
						<image :src="item.imgurl" class="user-img"></image>
						<div class="message">
							<!-- 文字 -->
							<div class="msg-text" v-if="item.types == 0">{{item.message}}</div>
							<!-- 图片 -->
							<image class="msg-img" mode="widthFix" :src="item.message" 
							v-if="item.types == 1" @tap="previewImg(item.message)"></image>
						</div>
					</div>
					
				</div>
				
			</div>
			<!-- <div class="bottom"></div> -->
		</scroll-view>
		
		<submit @inputs="inputs" @heights="heights"></submit>
	</view>
</template>

<script>
	import NavBar from '../../components/common/navbar/NavBar.vue'
	import Submit from '../../components/content/submit/submit.vue'
	import myfun from '../../commons/js/myfun.js'
	export default {
		data() {
			return {
				uid: '',
				uimgurl: '',
				token: '',
				// url带过来的
				fid: '',
				fname: '',
				fimgurl: '',
				type: '',
				
				inputH: '72',
				animationData: {},
				msgs: [],
				imgMsg: [],
				scrollToView: '',
				
				pastTime: 0,
				nowPage: 1,
				pageSize: 8,
				
				loading: '',
				isloading: true,
				swanition: true,
				beginloading: true,
				
			}
		},
		components: {
			NavBar,
			Submit
		},
		onLoad(e) {
			this.fid = e.id;
			this.fname = e.name;
			this.fimgurl = e.img;
			this.type = e.type;
			this.getStorages();
			this.getMsg();
			this.receiveSocketMsg();
			// this.nextPage();
		},
		methods: {
			// 获取缓存数据
			getStorages() {
				try {
					const value = uni.getStorageSync('user')
					if (value) {
						this.uid = value.id;
						this.uimgurl = this.serverUrl + value.imgurl;
						this.token = value.token;
					} else {
						uni.navigateTo({
							url: '../login/login'
						});
					}
					
				} catch (e) {
					
				}
			},
			// 获取聊天信息
			getMsg(page) {
				uni.request({
					url: this.serverUrl + '/chat/msg',
					data: {
						uid: this.uid,
						fid: this.fid,
						nowPage: this.nowPage,
						pageSize: this.pageSize,
						token: this.token
					},
					method: 'POST',
					success: data => {
						let status = data.data.status;
						switch (status) {
							case 200:
								var res = data.data.result;
								
								res.reverse();
								
								var oldT = res[0].time;
								var imgarr = [];
								
								for (let i = 1; i < res.length; i++) {
									res[i].imgurl = this.serverUrl + res[i].imgurl;
									// 时间间隔
									if (i < res.length -1) {
										let t = myfun.jiangeTime(oldT, res[i].time);
										if (t) {
											oldT = t;
										}
										res[i].time = t;
									}
									// 匹配最大时间
									if (this.nowPage == 1) {
										if (res[i].time > this.pastTime) {
											this.pastTime = res[i].time;
										}
									}
									// 图片地址
									if (res[i].types == 1) {
										res[i].message = this.serverUrl + res[i].message;
										imgarr.push(res[i].message);
										// this.imgMsg.unshift(res[i].message)
										
									}
									// this.msgs.unshift(res[i]);
								}
								this.msgs = res.concat(this.msgs);
								this.imgMsg = imgarr.concat(this.imgMsg);
							
								// // pan断nowPage
								if (res.length == 8) {
									this.nowPage++;
								} else {
									this.nowPage = -1;
								}
								// // 
								this.$nextTick(function(){
									this.swanition = false;
									this.scrollToView = 'msg' + this.msgs[res.length - 1].id;
								});
								// 清除loading的动画和显示
								clearInterval(this.loading);
								this.isloading = true;
								//  开启加载
								this.beginloading = true;
								break;
							case 500:
								uni.showToast({
									title: '服务器出错',
									icon: 'none',
									duration: 1500
								});
								break;
							case 300: 
								// token过期
								uni.reLaunch({
									url: '../login/login'
								});
								break;
						}
					}
				})
			},
			// 顶部加载下一页
			nextPage() {
				if (this.nowPage > 0 && this.beginloading) {
					// 出现loading
					this.isloading = false;
					// 取消重复加载
					this.beginloading = false;
					
					var animation = uni.createAnimation({
						duration: 1000,
						timingFunction: 'step-start',
					})
					this.animation = animation;
					
					let i = 1;
					this.loading = setInterval(function() {
						animation.rotate(i * 30).step()
						this.animationData = animation.export()
						i++;
						// 获取聊天数据
						if (i > 20) {
							this.getMsg(this.nowPage);
						}
						
					}.bind(this), 100)
				}
				
			},
			// 预览图片
			previewImg(e) {
				let index = 0;
				for (let i = 0; i < this.imgMsg.length; i++) {
					if (this.imgMsg[i] == e) {
						index = i;
					}
				}
				uni.previewImage({
					current: index,
					urls: this.imgMsg,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			// 接收输入内容
			inputs(e) {
				this.receiveMsg(e, this.uid, this.uimgurl, 0)
			},
			// 接shou消息
			receiveMsg(e, id, img, tip) {
				// tip===0自己发送 1他人发
				
				this.swanition = true;
				let len = this.msgs.length;
				let nowTime = new Date();
				// 时间间隔
				let t = myfun.jiangeTime(this.pastTime, nowTime);
				if (t) {
					this.pastTime = t;
				}
				
				nowTime = t;
				
				let data = {
					fromId: id,   //发送者id
					imgurl: img,
					message: e.message,
					types: e.types,
					time: nowTime,
					id: len
				}
				// 
				this.msgs.push(data);
				// 
				this.$nextTick(function(){
					this.scrollToView = 'msg' + len;
				})
				
				// socket提交
				if (e.types == 0 || e.types == 3) {
					// 发送给后端
					this.sendSocket(e);
				}
				if (e.types == 1) {
					this.imgMsg.push(e.message);
					// 提交图片
					let url = myfun.fileName(new Date());
					const uploadTask = uni.uploadFile({
					    url: this.serverUrl + '/files/upload', //仅为示例，非真实的接口地址
					    filePath: e.message,
					    name: 'file',
					    formData: {
					        url: url,
							name: new Date().getTime() + this.uid + Math.ceil(Math.random() * 10),
					    },
					    success: (uploadFileRes) => {
							let data = {
								message: uploadFileRes.data,
								types: e.types,
							}
							console.log(data)
							this.sendSocket(data)
					        // console.log(uploadFileRes)
					    }
					});
				}
				
			},
			// 聊天数据发送给后端
			sendSocket(e) {
				if (this.type == 0) {
					// 1dui1来天
					this.socket.emit('msg', e, this.uid, this.fid);
				} else {
					// qun消息
					this.socket.emit('groupMsg', e, this.uid, this.fid);
				}
			},
			// socket聊天数据接收
			receiveSocketMsg() {
				this.socket.on('msg', (msg, fromid) => {
					console.log('服务器法国' + msg.message)	
					this.swanition = true;
					let len = this.msgs.length;
					
					let nowTime = new Date();
					// 时间间隔
					let t = myfun.jiangeTime(this.pastTime, nowTime);
					if (t) {
						this.pastTime = t;
					}
					if (msg.types == 1 || msg.types == 2) {
						msg.message = this.serverUrl + msg.message
					}
					nowTime = t;
					console.log('服务器法国被我夹了' + msg.message);
					// let data = {
					// 	fromId: fromid,   //发送者id
					// 	imgurl: this.fimgurl,
					// 	message: msg.message,
					// 	types: msg.types,
					// 	time: nowTime,
					// 	id: len
					// }
				
					// this.msgs.push(data);
					if (msg.types == 1) {
						this.imgMsg.push(msg.message);
					}
				})
			},
			// 输入框高度
			heights(e) {
				console.log(e);
				this.inputH = e;
				this.goBot();
			},
			
			// gundong 到底部
			goBot() {
				this.swanition = true;
				this.scrollToView = '';
				this.$nextTick(function(){
					let len = this.msgs.length -1;
					this.scrollToView = 'msg' + this.msgs[len].id;
				})
			},
			
			changeTime(date) {
				return myfun.dateTimeChat(date);
			},
			back() {
				uni.reLaunch({
					url: '../index/index'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}
	.content {
		height: 100%;
		background-color: rgba(244,244,244,1);
	}
	.my-nav-bar {
		background-color: rgba(244,244,244,1);
		image {
			width: 30px;
			height: 30px;
			vertical-align: middle;
		}
		span {
			font-weight: 550;
			font-size: 18px;
			vertical-align: middle;
		}
	}
	.notDisplay {
		display: none;
	}
	.chat {
		height: 100%;
		.bottom {
			height: env(safe-area-inset-bottom);
			width: 100%;
		}
		.loading {
			text-align: center;
			.loading-img {
				width: 40rpx;
				height: 40rpx;
			}
		}
		.chat-main {
			padding: 100rpx $uni-spacing-col-base 0;
			// padding-right: $uni-spacing-col-base;
			display: flex;
			flex-direction: column;
		}
		.chat-every {
			.chat-time {
				font-size: $uni-font-size-sm;
				color: rgba(39, 40, 50,.3);
				line-height: 34rpx;
				padding: 20rpx 0;
				text-align: center;
			}
			.msg-m {
				display: flex;
				padding: 20rpx 0;
				.user-img {
					width: $uni-img-size-sm;
					height: $uni-img-size-sm;
					border-radius: $uni-border-radius-base;
				}
				.message {
					// flex: auto;
					max-width: 400rpx;
					.msg-text {
						font-size: $uni-font-size-lg;
						color: $uni-text-color;
						line-height: 44rpx;
						padding: 18rpx 24rpx;
					}
					.msg-img {
						max-width: 400rpx;
						border-radius: $uni-border-radius-base;
					}
				}
				
			}
			.msg-left {
				flex-direction: row;
				.msg-text {
					background-color: #fff;
					margin-left: 16rpx;
					border-radius: 0px 20rpx 20rpx 20rpx;
				}
				.msg-img {
					margin-left: 16rpx;
				}
			}
			.msg-right {
				flex-direction: row-reverse;
				.msg-text {
					background-color: #fff260;
					margin-right: 16rpx;
					border-radius: 20rpx 0rpx 20rpx 20rpx;
				},
				.msg-img {
					margin-right: 16rpx;
				}
			}
		}
	}
</style>
