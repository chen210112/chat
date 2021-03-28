<template>
	<div class="info-table">
		<div class="logo">
			<slot name="logo"></slot>
		</div>
		
		<div class="main">
			<div class="title">
				<slot name="title"></slot>
			</div>
			<div class="info">
				<slot name="info">
					<slot name="user">
						<input type="text" placeholder="用户名" placeholder-style="color:#aaa;font-weight: 400;"/>
					</slot>
					<slot></slot>
					<slot name="password">
						<input type="password" placeholder="密码" placeholder-style="color:#aaa;font-weight: 400;">			
					</slot>
					<div class="tips">
						<slot name="tips">
						</slot>
					</div>
				</slot>
			</div>
		</div>
		
		<div class="submit">
			<slot name="submit">
				<button type="submit"></button>
			</slot>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'InfoTable',
		data() {
			return {
				user: '',
				password: ''
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.logo {
		text-align: center;
	}
	.main {
		margin: 60rpx $uni-spacing-row-lg 120rpx;
		width: auto;
		.title {
			font-size: 50rpx;
			line-height: 1.5;
			font-weight: 500;
			color: $uni-text-color;
		}
		.info {
			input {
				margin-top: 40rpx;
				height: 88rpx;
				font-size: $uni-font-size-lg;
				font-weight: 500;
				color: $uni-text-color;
				line-height: 88rpx;
				border-bottom: 1px solid $uni-border-color;
			}
		}
		.tips {
			float: left;
			font-size: $uni-font-size-base;
			color: $uni-color-warning;
			line-height: 1.5;
		}
	}
	
	.submit button {
		background-color: $uni-color-primary;
		color: #fff;
		font-size: $uni-font-size-lg;
		width: 200px;
		height: 40px;
		line-height: 40px;
		border: 1px solid #ff7d0a;
		border-radius: $uni-border-radius-sm;
	}
</style>
