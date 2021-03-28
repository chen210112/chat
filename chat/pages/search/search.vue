<template>
	<div class="search">
		<nav-bar class="my-nav-bar">
			<input slot="left" type="search" placeholder="搜索用户/群" class="search" placeholder-style="color:#aaa;font-weight:400;"
			@input="search">
			<span slot="right" class="myright">
				<image src="../../static/images/icon/search.png"></image>
				<span @tap="backOne">取消</span>
			</span>
		</nav-bar>
		
		<div class="main">
			<div class="search-user-result">
				<div class="title">用户</div>
				<message-list class="my-message-list" v-for="(item, index) in friendArr" :key="index">
					<div slot="left" class="son-left">
						<image :src="item.imgurl"></image>
					</div>
					<div slot="main" class="son-main">
						<div class="name" v-html="item.name"></div>
					</div>
					<!-- <div slot="right" class="son-right"> -->
						<!-- <button>发消息</button> -->
						<!-- <button v-if="item.isFri === 0">加好友</button> -->
					<!-- </div> -->
				</message-list>
			</div>
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
				friendArr: [],
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
				this.friendArr = [];
				let searchval = e.detail.value;
				if (searchval.length > 0) {
					this.searchFriend(searchval);
				}
			}, 500), 
			// 寻找关键词匹配好友
			searchFriend(e) {
				uni.request({
					url: this.serverUrl + '/search/friend',
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
								let fArr = data.data.result;
								let exp = eval("/" + e + "/g")
								for (let i = 0; i < fArr.length; i++) {
									if (fArr[i].name.search(e) != -1) {
										// this.isFriend(arr[i])
										fArr[i].imgurl = this.serverUrl + fArr[i].imgurl;
										fArr[i].name = fArr[i].name.replace(exp, "<span style='color: orange;'>" + e + "</span>")
										// arr[i].email = arr[i].email.replace(exp, "<span style='color:#4AAAFF;'>" + e + "</span>")
										this.friendArr.push(fArr[i]);
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
								// token过期
								uni.navigateTo({
									url: '../login/login'
								});
								break;
						}
					}
				})
			},
			// isFriend(e) {
			// 	let isFri = 0;
			// 	if (e._id == this.uid) {
			// 		isFri = 2;
			// 		e.isFri = isFri;
			// 	} else {
			// 		uni.request({
			// 			url: this.serverUrl + '/search/isfriend',
			// 			data: {
			// 				uid: this.uid,
			// 				fid: e._id,
			// 				token: this.token
			// 			},
			// 			method: 'POST',
			// 			success: (data) => {
			// 				let status = data.data.status;
			// 				switch (status) {
			// 					case 200: 
			// 						// 是好友
			// 						isFri = 1;
			// 						break;
			// 					case 400:
			// 					 // 不是好友									
			// 						break;
			// 					case 500:
			// 						uni.showToast({
			// 							title: '服务器出错',
			// 							icon: 'none',
			// 							duration: 1500
			// 						});
			// 						break;
			// 					case 300: 
			// 						// token过期
			// 						uni.navigateTo({
			// 							url: '../login/login'
			// 						});
			// 						break;
			// 				}
			// 				e.isFri = isFri;
			// 			}
			// 		})
			// 	}
								
			// }
		}
	}
</script>

<style lang="scss">
	.my-nav-bar {
		// border: 1px solid red;
		
		input {
			display: inline-block;
			vertical-align: middle;
			text-align: left;
			// width: 500rpx;
			width: 95%;
			height: 60rpx;
			background-color: $uni-bg-color-grey;
			border-radius: $uni-border-radius-sm;
		}
		.myright {
			image {
				width: 50rpx;
				height: 50rpx;
				vertical-align: middle;
				margin-left: -160rpx;
			}
			span {
				vertical-align: middle;
				padding-left: 30rpx;
				font-size: $uni-font-size-lg;
				font-weight: 550;
			}
		}
	}
	
	.main {
		padding-top: 108rpx;
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
				.son-main {
					.name {
						font-size: 32rpx;
						font-weight: 400;
						// margin-left: -20rpx;
					}
				}
			}
		}
	}
</style>
