<template>
	<view class="content">
		<nav-bar class="my-nav-bar">
			<image slot="left" @tap="back" src="../../static/images/icon/back.png"></image>
			<span slot="center">好友请求</span>
		</nav-bar>
		<main>
			<message-list class="friend-request" v-for="(item,index) in friendsRequest" :key="index">
				<div slot="left" class="son-left">
					<image :src="serverUrl + item.imgurl"></image>
				</div>
				<div slot="main-above" class="son-main">
					<div class="name">{{item.name}}</div>
				</div>
				<div slot="main-under">
					<span>{{item.msg}}</span>
				</div>
				<div slot="right" class="son-right">
					<button class="agree" @tap="agree(item.id)">同意</button>
					<button class="reject" @tap="refuse(item.id)">拒绝</button>
				</div>
			
			</message-list>
			
		</main>
	</view>
</template>

<script>
	import NavBar from '../../components/common/navbar/NavBar.vue'
	import MessageList from '../../components/common/messagelist/MessageList.vue'
	
	export default {
		data() {
			return {
				uid: '',
				token: '',
				myname: '',
				
				friendsRequest: []
			};
		},
		components: {
			NavBar,
			MessageList
		},
		onLoad() {
			this.getStorages();
			this.getFriendsRequest();
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
			getLeave: function (arr, i) {
				uni.request({
					url: this.serverUrl + '/index/getlastmsg',
					data: {
						uid: this.uid,
						fid: arr[i].id,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						switch (status) {
							case 200: 
								let res = data.data.result;
								let e = arr[i];
								e.msg = res.message;
								arr.splice(i,1,e);
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
				});
			},
			getFriendsRequest: function () {
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
								let res = data.data.result;
								for (let i = 0; i < res.length; i++) {
									this.getLeave(res, i);
									for (let j = 0; j < 10000000; j++) {
										//加长请求之间的间隔
									}
								}
								this.friendsRequest = res;
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
			refuse(fid) {
				uni.request({
					url: this.serverUrl + '/friend/deletefriend',
					data: {
						uid: this.uid,
						fid,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						switch (status) {
							case 200: 
								for (let i = 0; i < this.friendsRequest.length; i++){
									if (this.friendsRequest[i].id === fid) {
										this.friendsRequest.splice(i, 1);
									}
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
								uni.reLaunch({
									url: '../login/login'
								});
								break;
						}
					}
				});
			},
			agree(fid) {
				uni.request({
					url: this.serverUrl + '/friend/updatefriendstate',
					data: {
						uid: this.uid,
						fid,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						switch (status) {
							case 200: 
								for (let i = 0; i < this.friendsRequest.length; i++){
									if (this.friendsRequest[i].id === fid) {
										this.friendsRequest.splice(i, 1);
									}
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
								uni.reLaunch({
									url: '../login/login'
								});
								break;
						}
					}
				});
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
	.content {
		background-color: rgba(1,1,1,.1);
	}
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
	
	main {
		background-color: white;
		padding-top: 108rpx;
		border-bottom: 1px solid rgba(1,1,1,.1);
		.friend-request {
			&:active {
				background-color: transparent;
			}
			padding: 10rpx 20rpx;
			// border: 1px solid red;
			.son-left {
				// border: solid;
				display: inline-block;
				// vertical-align: middle;
				image {
					width: $uni-img-size-sm;
					height: $uni-img-size-sm;
					// height: 30rpx;
					border-radius: $uni-border-radius-base;
					vertical-align: middle;
				}
			}
			.son-right {
				display: inline-block;
				vertical-align: middle;
				button {
					display: inline-block;
					width: 120rpx;
					height: 48rpx;
					background-color: rgba(1,1,1,.1);
					border-radius: 24rpx;
					font-size: $uni-font-size-sm;
					line-height: 48rpx;
					text-align: center;
				}
				.agree {
					margin-right: 18px;
					background-color: skyblue;
					color: white;
				}
			}
			.son-main {
				.name {
					font-size: 32rpx;
					font-weight: 400;
					// margin-left: -20rpx;
				}
			}
		}
	}
</style>
