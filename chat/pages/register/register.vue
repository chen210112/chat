<template>
	<view>
		<nav-bar class="my-nav-bar">
			<image slot="left" src="../../static/images/icon/back.png" @tap="toLogin"></image>
		</nav-bar>
		<info-table class="my-register">
			<image slot="logo" src="../../static/images/img/chat.png"></image>
			
			<div slot="user">
				<input type="text" placeholder="请输入名字" v-model="user" @input="getUser">
				<span class="employ" v-if="isUserEmploy">用户名已占用</span>
			</div>
			<div slot="">
				<input type="text" placeholder="请输入邮箱" v-model="email" @input="getEmail">
				<span class="employ" v-if="isEmailEmploy">邮箱已占用</span>
				<span class="invalid" v-if="isEamilInvalid">邮箱名无效</span>
			</div>
			<div slot="password">
				<input type="password" placeholder="请输入密码" v-model="pwd" @input="getPwd">
				<span class="invalid" v-if="isPwdInvalid">密码至少6位</span>
			</div>
			
			<button slot="submit" 
					:class="{'btn-disable': btnDisable}"
					@tap="register">注册
			</button>
		</info-table>
	</view>
</template>

<script>
	import NavBar from '../../components/common/navbar/NavBar.vue'
	import InfoTable from '../../components/common/infotable/InfoTable.vue'
	export default {
		data() {
			return {
				user: '',
				pwd: '',
				email: '',
				
				isEamilInvalid: false,
				isPwdInvalid: false,
				
				isUserEmploy: false,
				isEmailEmploy: false,
				
				btnDisable: true
			}
		},
		components: {
			NavBar,
			InfoTable
		},
		methods: {
			// 跳转到登录页
			toLogin() {
				uni.navigateBack({
					delta: 1
				});
			},
			
			// 表单验证
			getEmail(e) {	
				// 判断邮箱格式
				let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
				// this.email = e.detail.value;
				if (this.email.length > 0) {
					if (reg.test(this.email)) {
						// 邮箱格式正确
						this.isEamilInvalid = false;
						// 到服务端验证邮箱是否存在
						uni.request({
							url: this.serverUrl + '/register/judge',
							data: {
								type: 'email',
								data: this.email
							},
							method: 'POST',
							success: (data) => {
								if (data.data.count > 0) {
									this.isEmailEmploy = true;
								} else {
									this.isEmailEmploy = false;
								}
								this.isOk();
							}
						});
					} else {
						this.isEmailEmploy = false;
						this.isEamilInvalid = true;
					}
				}
				this.isOk();
			},
			getUser(e) {
				// this.user = e.detail.value;
				// 到服务端验证用户名是否存在
				uni.request({
					url: this.serverUrl + '/register/judge',
					data: {
						type: 'name',
						data: this.user
					},
					method: 'POST',
					success: (data) => {
						// console.log(data)
						let status = data.data.status;
						if (status == 200) {
							if (data.data.count > 0) {
								this.isUserEmploy = true;
							} else {
								this.isUserEmploy = false;
							}
							this.isOk();
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错',
								icon: 'none',
								duration: 1500
							})
						}
					}
				});
				
				this.isOk();
			},
			getPwd(e) {
				// this.pwd = e.detail.value;
				if (this.pwd.length < 6) {
					this.isPwdInvalid = true;
				} else {
					this.isPwdInvalid = false;
				}
				this.isOk();
			},
			// 控制按钮是否可点击状态
			isOk() {
				// 可点击状态
				if (this.user && this.pwd.length > 5 && 
					this.email && !this.isEamilInvalid && 
					!this.isUserEmploy && !this.isEmailEmploy ) {
					this.btnDisable = false;
					return true;
				} else {
					this.btnDisable = true;
					return false;
				}
			},
			
			// 与服务端交互
			// 注册
			register() {
				if (this.isOk()) {
					// console.log('hhhh');
					uni.request({
						url: this.serverUrl + '/register/add',
						data: {
							name: this.user,
							mail: this.email,
							pwd: this.pwd
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status;
							if (status == 200) {
								uni.navigateTo({
									url: '../login/login'
								})
							}
						}
					});
					// this.user = '';
					// this.isOk();
				}
			}
		}
	}
</script>

<style lang="scss">
	.my-nav-bar {
		image {
			width: 50rpx;
			height: 50rpx;
			vertical-align: middle;
		}
	}
	.my-register {
		padding-top: 120px;
		image {
			width: 120rpx;
			height: 120rpx;
		}
		.employ,
		.invalid {
			float: right;
			font-size: $uni-font-size-base;
			font-weight: 550;
			color: $uni-color-warning;
			margin-top: -88rpx;
			line-height: 88rpx;
		}
		
		.btn-disable {
			background-color:#d4d4d4;
			border-color:#d4d4d4;
			color:#fff;
			// disabled: true;
		}
	}
	
		
</style>
