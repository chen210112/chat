<template>
	<div class="add">
		<nav-bar class="my-nav-bar">
			<span slot="left" class="my-left" @tap="backOne">
				<image src="../../static/images/icon/back.png"></image>
				<span>添加好友/群</span>
			</span>
		</nav-bar>
		
		<div class="main">
			<div>
				<input  type="search" placeholder="id/邮箱" class="search" placeholder-style="color:#aaa;font-weight:400;"
				confirm-type="search" @confirm="search">
			</div>
			
			<!-- <div class="search-user-result">
				<div class="title" v-show="userArr.length > 0">用户</div>
				<navigator :url="'../userHome/userHome?id=' + item._id" v-for="(item, index) in userArr" :key="index" >
					<message-list class="my-message-list">
						<div slot="left" class="son-left">
							<image :src="item.imgurl"></image>
						</div>
						<div slot="main-above" class="name" v-html="item.name"></div>
						<div slot="main-under" class="email" v-html="item.email"></div>
					</message-list>
				</navigator>
			</div> -->
		</div>
	</div>
</template>

<script>
	import NavBar from '../../components/common/navbar/NavBar.vue'
	import MessageList from '../../components/common/messagelist/MessageList.vue'
	import myfun from '../../commons/js/myfun.js'
	export default {
		name: 'Search',
		data() {
			return {
				users: [],
				uid: '',
				token: '',
				myname: ''
			}
		},
		onLoad() {
			this.getStorages()
		},
		components: {
			NavBar,
			MessageList
		},
		methods: {
			backOne() {
				uni.navigateBack({
					delta: 1
				})
			},
			toUserHome() {
				uni.navigateTo({
					url: '../userHome/userHome'
				});
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
				} catch (e) {
					
				}
			},
			// huo取关键词
			search: myfun.debounce(function(e) {
				this.users = [];
				let searchval = e.detail.value;
				if (searchval.length > 0) {
					this.searchUser(searchval);
				}
			}, 500), 
			// 寻找关键词匹配用户
			searchUser(e) {
				uni.request({
					url: this.serverUrl + '/add/user',
					data: {
						data: e,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						switch (status) {
							case 200: 
								let users = data.data.result;
								if (users.length === 0) {
									uni.showToast({
										title: '用户不存在',
										icon: 'none',
										duration: 3300
									});
								} else {
									uni.navigateTo({
										url: '../userHome/userHome' + '?id=' + users[0]._id
									});
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
								uni.navigateTo({
									url: '../login/login'
								});
								break;
						}
					}
				})
			}
			
		}
	}
</script>

<style lang="scss">
	.my-nav-bar {
		// border: 1px solid red;
		.my-left {
			image {
				width: 16px;
				height: 16px;
				vertical-align: middle;
			}
			span {
				vertical-align: middle;
				font-size: $uni-font-size-lg;
				font-weight: 550;
			}
		}
	}
	
	.main {
		padding-top: 108rpx;
		input {
			text-align: center;
			width: 88%;
			height: 25px;
			margin: 0 auto;
			background-color: $uni-bg-color-grey;
			border-radius: $uni-border-radius-sm;
		}
		.search-user-result {
			.title {
				font-size: 42rpx;
				line-height: 66rpx;
				font-weight: 600;
				margin-left: 20rpx;
			}
			.my-message-list {
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
						min-width: 120rpx;
						height: 48rpx;
						background-color: $uni-color-primary;
						border-radius: 24rpx;
						font-size: $uni-font-size-sm;
						line-height: 48rpx;
						text-align: center;
					}
				}
				
				.name {
					font-size: 32rpx;
					font-weight: 400;
					// margin-left: -20rpx;
				}
				.email {
					font-size: 20rpx;
				}
				
			}
		}
	}
</style>
