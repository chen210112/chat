<template>
	<view class="content">
		<!-- 上 -->
		<nav-bar class="my-nav-bar">
			<!-- 使用内联标签是因为被替换的插槽所在的父元素最后设置了一个after伪元素，该伪元素的作用是使得其兄弟内联元素垂直居中显示 -->
			<!-- 如果使用块标签，伪元素就被挤到下一行。其作用就无法生效了 -->
			<span slot="left" class="my-left">
				<!-- <image src="../../static/images/img/tou1.png"></image> -->
				<span>chat</span>
			</span>
			<span slot="right" class="my-right">
				<div class="search"><image @tap="toSearch" src="../../static/images/icon/search.png"></image></div>
				<div class="add"><image @tap="toAdd" src="../../static/images/icon/add.png"></image></div>
			</span>
			<!-- <span slot="center" class="my-center">
				<image src="../../static/images/img/chat.png"></image>
			</span> -->
		</nav-bar>
		<!-- 中 -->
		<div class="main">
			<message-list class="my-message-list"  v-if="friendsRequest.length > 0" @click.native="toFriendRequest">
				<div slot="left" class="sonleft">
					<image src="../../static/images/icon/apply.png"></image>
					<div class="tip">
						<span class="tipt">{{friendsRequest.length}}</span>
					</div>
				</div>
				<div slot="main" class="">
					<div class="name">好友申请</div>
				</div>
				
			</message-list>
			
			<message-list class="my-message-list" v-for="(item, index) in friends" :key="index" @click.native="toChat(item)">
				<div slot="left" class="sonleft">
					<image :src="serverUrl + item.imgurl"></image>
					<div class="tip">
						<span v-if="item.tipNum" class="tipt">{{item.tipNum}}</span>
					</div>
				</div>
				<div slot="main-above" class="son-main-above">
					<div class="name">{{item.name}}</div>
					<div class="time">{{changeTime(item.lastTime)}}</div>
				</div>
				
				<span slot="main-under">{{item.msg}}</span>
			</message-list>
		</div>
		
		
	</view>
</template>

<script>
	import NavBar from '../../components/common/navbar/NavBar.vue'
	import MessageList from '../../components/common/messagelist/MessageList.vue'
	
	import myfun from '../../commons/js/myfun.js'
	export default {
		data() {
			return {
				uid: '',
				token: '',
				myname: '',
				uimgurl: '',
				friends: [],
				friendsRequest: []
			}
		},
		components: {
			NavBar,
			MessageList
		},
		onLoad() {
			this.getStorages();
			this.getFriendsRequest();
			this.getFriends();
			this.join(this.uid);
			this.socketTest()
		},
		onPullDownRefresh() {
			console.log('refresh');
			this.getStorages();
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			toSearch() {
				uni.navigateTo({
					url: '../search/search'
				});
			},
			toAdd() {
				uni.navigateTo({
					url: '../add/add'
				})
			},
			toFriendRequest() {
				uni.navigateTo({
					url: '../friendRequest/friendRequest'
				})
			},
			toChat(data) {
				uni.navigateTo({
					url: '../chat/chat?id=' + data.id + '&name=' + data.name + '&img=' + data.imgurl + '&type=' + data.type
				})
			},
			changeTime(date) {
				return myfun.dateTime(date);
			},
			// 获取缓存数据
			getStorages() {
				try {
					const value = uni.getStorageSync('user')
					if (value) {
						this.uid = value.id;
						this.uimgurl = this.serverUrl + value.imgurl;
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
			getFriendsRequest() {
				uni.request({
					url: this.serverUrl + '/index/getfriend',
					data: {
						uid: this.uid,
						state: 1,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						switch (status) {
							case 200: 
								this.friendsRequest = data.data.result;
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
			getFriends() {
				uni.request({
					url: this.serverUrl + '/index/getfriend',
					data: {
						uid: this.uid,
						state: 0,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						switch (status) {
							case 200: 
								let res = data.data.result;
								for (let i = 0; i < res.length; i++) {
									this.friends.push(res[i]);
								}
								this.friends = myfun.mySort(this.friends, 'lastTime', 0);
								// 下面两个方法都是异步，不能放在上面的循环内
								for (let i = 0; i < this.friends.length; i++) {
									this.getLastMsg(this.friends, i);
									for (let j = 0; j < 10000000; j++) {
										//加长请求之间的间隔,好像没作用
									}
									this.getUnread(this.friends, i);
								}
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
			getLastMsg(arr, i) {
				uni.request({
					url: this.serverUrl + '/index/getlastmsg',
					data: {
						uid: this.uid,
						fid: arr[i].id,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						switch (status) {
							case 200:
								let res = data.data.result;
								switch (res.types) {
									case '0':
										break;
									case '1':
										res.message = '[图片]';
										break;
									case '2':
										res.message = '[音频]';
										break;
									case '3':
										res.message = '[位置]';
										break;
								}
								let e = arr[i];
								e.msg = res.message;
								arr.splice(i, 1, e);
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
			getUnread(arr, i) {
				uni.request({
					url: this.serverUrl + '/index/unreadmsg',
					data: {
						uid: this.uid,
						fid: arr[i].id,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						switch (status) {
							case 200:
								let res = data.data.result;
								let e = arr[i];
								e.tipNum = res;
								arr.splice(i, 1, e);
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
			// socket
			// 用户登录socketl注册
			join(uid) {
				this.socket.emit('login', uid)
			},
			//服务器消息接收
			 socketTest() {
				 this.socket.on('msg', id => {
					 // console.log('登录：' + id);
				 })
			 }
		}
	}
</script>

<style lang="scss">
	.content {
		// display: flex;
		// flex-direction: column;
		// align-items: center;
		// justify-content: center;
	}
	
	// 上
	.my-nav-bar {
		// border: solid;
		.my-left {
			image {
				width: $uni-img-size-sm;
				height: $uni-img-size-sm;
				border-radius: $uni-border-radius-sm;
				// 垂直居中
				vertical-align: middle;
			}
		}
		.my-center {
			image {
				width: 68rpx;
				height: 68rpx;
				vertical-align: middle;
			}
		}
		.my-right {
			.search,
			.add {
				display: inline-block;
				padding-left: 10rpx;
				vertical-align: middle;
			}
			image{
				width: 60rpx;
				height: 60rpx;
			}
		}
	}
	
	// 中
	.main {
		padding-top: 88rpx;
		// border: 2px solid green;
		// width: 100%;
		// box-sizing: border-box;
		.my-message-list {
			// width: 100%;
			.sonleft {
				image {
					width: $uni-img-size-base;
					height: $uni-img-size-base;
					border-radius: $uni-border-radius-base;
					vertical-align: text-bottom;
				}
				.tip {
					// border: 1px solid red;
					// margin-top负值后父元素高度重新计算了
					margin: -98rpx 0 0 68rpx;
					// 奇怪的是，设置margin负值后尽管是移动到期望的位置，但是却遮住了。只好设置z-index
					position: relative;
					z-index: 3;
					// 设置text-box高度比.tipt的高度小，使得.tip的高度由.tipt决定
					line-height: 16rpx;
				}
				.tipt {
					// 消灭它的宽度
					position: absolute;
					color: white;
					display: inline-block;
					min-width: 26rpx;
					height: 26rpx;
					background-color: red;
					border-radius: 13rpx;
					text-align: center;
					line-height: 26rpx;
					font-size: 18rpx;
				}
			}
			.son-main-above {
				.name {
					float: left;
					font-size: 36rpx;
					font-weight: 400;
					color: $uni-text-color;
				}
				.time {
					float: right;
					font-size: $uni-font-size-sm;
					color: $uni-text-color-disable;
				}
			}			
		}
	}
</style>
