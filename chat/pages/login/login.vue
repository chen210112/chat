<template>
	<div class="content">
		<nav-bar>
			<span slot="right" class="myright">
				<span class="text" @tap="toRegister">注册</span>
			</span>
		</nav-bar>
		<!-- 该组件根标签的类名一般是其组件名，所以我使用该组件，再给其根标签加类，类名命名为“my+原类名” -->
		<info-table class="mylogin">
			<div slot="logo">
				<image  src="../../static/images/img/chat.png" ></image>
			</div>
			<input type="text" slot="user" v-model="user" placeholder="用户名" >
			<input type="password" slot="password" v-model="password" placeholder="密码" >
			<span slot="tips" v-if="isError">用户名或密码错误</span>
			<button slot="submit" @tap="login">登录</button>
		</info-table>
	</div>
</template>

<script>
	import NavBar from '../../components/common/navbar/NavBar.vue'
	import InfoTable from '../../components/common/infotable/InfoTable.vue'
	export default {
		data() {
			return {
				user: '',
				password: '',
				isError: false,
				token: ''
			}
		},
		components: {
			NavBar,
			InfoTable
		},
	
		methods: {
			// 
			toRegister() {
				uni.navigateTo({
					url: '../register/register'
				});
			},
			// 
			// testToken() {
			// 	// console.log('ff')
			// 	uni.request({
			// 		url: 'http://localhost:3000/index/getlastmsg',
			// 		data: {
			// 			uid: '6054547a31f004530c4d1a01',
			// 			fid: '60545df831f004530c4d1a02',
			// 			// msg: '好友请求3'
			// 			// state: 0
			// 			// data: 'xiaoming@qq.com',
			// 			// type: 'email',
			// 			// pwd: '123456'
			// 		},
			// 		method: 'POST',
			// 		success: (data) => {
			// 			console.log(data)
			// 		}
			// 	});
			// },
			login() {
				uni.request({
					url: this.serverUrl + '/login/match',
					data: {
						data: this.user,
						pwd: this.password
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						if (status == 200) {
							this.isError = false;
							let back = data.data.back;
							// 本地存储用户信息
							try {
								uni.setStorageSync('user', {'id': back.id, 'name': back.name, 'imgurl': back.imgurl, 'token': back.token})
								
							} catch(e) {
								console.log('数据存储错误')
							}
							// 跳转到首页
							uni.navigateTo({
								url: '../index/index'
							})
						} else if (status == 400) {
							this.isError = true;
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错',
								icon: 'none',
								duration: 1500
							})
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.content {
		padding-top: var(--status-bar-height);
	}
	.myright {
		.text {
			font-size: $uni-font-size-lg;
			// font-size: 36rpx;
			font-weight: 550;
			color: $uni-text-color;
			vertical-align: middle;
		}
	}
	
	.mylogin{
		padding-top: 120px;
	// 	text-align: center;
		image {
			width: 120rpx;
			height: 120rpx;
		}
	}
	
</style>
