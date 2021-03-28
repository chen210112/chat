<template>
	<view class="content">
		<nav-bar class="my-nav-bar">
			<image slot="left" src="../../static/images/icon/back.png" @click="back"></image>
			<image slot="right" src="../../static/images/icon/more.png" @click="more"></image>
		</nav-bar>
		
		<div class="main">
			<div class="logo">
				<image class="header" :src="user.imgurl"></image>
			</div>
			<div class="info">
				<div class="name"><span>{{user.name}}</span></div>
			</div>
			<button class="btn" @tap="addFriendAnimation" v-if="relation == 2">加为好友</button>
			<button class="btn" v-if="relation == 1">发消息</button>
		</div>
		
		<view class="apply-msg" :style="{height: addHeight + 'px', bottom: -+addHeight+'px'}" :animation="animationData">
			<textarea v-model="msg"/>
			<button @tap="addFriendAnimation">取消</button>
			<button @tap="addFriend">发送</button>
		</view>
	</view>
</template>

<script>
	import NavBar from '../../components/common/navbar/NavBar.vue'
	import InfoTable from '../../components/common/infotable/InfoTable.vue'
	export default {
		name: 'UserHome',
		components: {
			NavBar,
			InfoTable
		},
		data() {
			return {
				id: '',
				
				uid: '',
				token: '',
				myname: '',
				
				relation: 0,
				
				addHeight: 0,
				animationData: {},
				isA: false,
				user: {},
				// msg: 'hello,我是' + this.myname
			}
		},
		computed: {
			msg() {
				return 'hello,我是' + this.myname
			}
		},
		onLoad(e) {
			this.id = e.id;
			this.getStorages();
			this.getUser();
			this.judgeFriend();
		},
		onReady() {
			this.getElementStyle()
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			more() {
				uni.navigateTo({
					url: '../userDetails/userDetails' + '?id=' + this.id + '&relation=' + this.relation
				})
			},
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
					console.log(this.myname)
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
								res.imgurl = this.serverUrl + res.imgurl;
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
			// 判断用户关系
			judgeFriend() {
				if (this.id == this.uid) {
					// 自己
					this.relation = 0;
				} else {
					uni.request({
						url: this.serverUrl + '/search/isfriend',
						data: {
							uid: this.uid,
							fid: this.id,
							token: this.token
						},
						method: 'POST',
						success: (data) => {
							// console.log(data);
							let status = data.data.status;
							switch (status) {
								case 200:
								// 是好友
									this.relation = 1;
									break;
								case 400:
								// 陌生人
									this.relation = 2;
									break;
								case 500:
									uni.showToast({
										title: '判断关系服务器出错',
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
					});
				}
			},
			// 获取页面高度
			getElementStyle() {
				const query = uni.createSelectorQuery().in(this)
				query.select('.content').boundingClientRect(data => {
					// console.log(JSON.stringify(data));
					this.addHeight = 0.5 * data.height;
				}).exec();
			},
			// 添加好友动画
			addFriendAnimation() {
				this.isA = !this.isA;
				var animation = uni.createAnimation({
					duration: 500,
					timingFunction: 'ease'
				});
				if (this.isA) {
					animation.bottom(0).step();
				} else {
					animation.bottom(-this.addHeight).step();
				}
				this.animationData = animation.export();
			},
			
			// 加好友
			addFriend() {
				this.addFriendAnimation();
				uni.request({
					url: this.serverUrl + '/friend/applyfriend',
					data: {
						uid: this.uid,
						fid: this.id,
						msg: this.msg,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						switch (status) {
							case 200: 
								uni.showToast({
									title: '好友请求发送成功',
									icon: 'none',
									duration: 3000
								})
								break;
							case 500: 
								uni.showToast({
									title: '服务器出错',
									icon: 'none',
									duration: 2000
								})
								break;
							case 300:
								uni.reLaunch({
									url: '../login/login'
								})
								break;
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page,
	.content {
		height: 100%;
		background-color: #F1F1F1;
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		// border: 4px solid red;
	}
	.my-nav-bar {
		image {
			width: 50rpx;
			height: 50rpx;
			vertical-align: middle;
		}
	}
	.main {
		// height: calc(100% - 108px);
		// border: 4px solid red;
		// width: 80%;
		// margin: auto;
		// text-align: center;
		.logo {
			position: relative;
			z-index: 9;
			.header {
				width: 200px;
				height: 200px;
				border-radius: 30px;
				vertical-align: bottom;
			}
			// .sex {
			// 	width: 30px;
			// 	height: 30px;
			// 	margin: -36px auto;
			// 	position: relative;
			// 	left: calc(100px - 15px - 10px);
			// 	line-height: 30px;
			// 	text-align: center;
			// 	background-color: red;
			// 	border-radius: 15px;
			// 	image {
			// 		width: 25px;
			// 		height: 25px;
			// 		vertical-align: middle;
			// 	}
			// }
		}
		.info {
			text-align: center;
			font-size: 26px;
			padding-top: 48px;
		}
		.btn {
			margin-top: 100px;
			font-size: 20px;
			line-height: 2;
			background-color: $uni-color-primary;
		}
	}
	.apply-msg {
		position: fixed;
		left: 0 ;
		right: 0;
		z-index: 0;
		background-color: white;
		border: 1px solid transparent;
		border-radius: 36px 36px 0 0 ;
		
		textarea {
			width: 80%;
			heigth: 60px;
			margin: 40px auto;
			background-color: #F1F1F1;
			border-radius: 18px;
			padding: 12px;
		}
		button {
			display: inline-block;
			width: 36%;
			margin-left: 10%;
			font-size: 18px;
			line-height: 1.8;
		}
		button:first-of-type {
			background-color: #F1F1F1;
		}
		button:last-of-type {
			background-color:  $uni-color-primary;
		}
	}
</style>
