<template>
	<div class="message-list">		
		<div class="left">
			<slot name="left"></slot>
		</div>
		
		<div class="right">
			<div class="m-right">
				<slot name="right"></slot>
			</div>
		</div>
		
		<div class="main">
			<slot name="main">
				<div class="main-above">
					<slot name="main-above"></slot>
				</div>
				<div class="main-under">
					<slot name="main-under"></slot>
				</div>
			</slot>
		</div>		
	</div>
</template>

<script>
	export default {
		name: 'MessageList'
	}
</script>

<style lang="scss">
	.message-list {
		// border: 1px solid red;
		height: 96rpx;
		padding: 16rpx 40rpx;
		&:active {
			background-color: $uni-bg-color-grey;
		}
		
		.left {
			float: left;
		}
		.left:after {
			content: '';
			line-height: 96rpx;
			vertical-align: middle;
		}
		.right {
			float: right;
			.m-right:after {
				content:'';
				line-height: 96rpx;
				vertical-align: middle;
			}
		}		
		.main {
			// border: solid;
			line-height: 96rpx;
			padding-left: 128rpx;
			.main-above {
				height: 48rpx;
				line-height: 48rpx;
			}
			.main-under {
				font-size: $uni-font-size-base;
				color: $uni-text-color-grey;
				line-height: 48rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
			}
		}
	}
</style>
