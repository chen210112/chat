<template>
	<view>
		<div class="submit">
			<div class="submit-chat">
				<!-- <div class="bt-img" @tap="record">
					<image src="tabPic"></image>
				</div> -->
				<textarea @input="inputs" v-model="msg" auto-height="true" class="chat-send btn" :class=""></textarea>
				<!-- <div class="record btn" :class="{notDisplay: !isrecord}">按住说话</div> -->
				<!-- <div class="bt-img" @tap="emoji">
					<image src="../../../static/images/submit/bq.png"></image>
				</div> -->
				<div class="bt-img" @tap="moreFun">
					<image src="../../../static/images/submit/tj.png"></image>
				</div>
			</div>
			<!-- 弹出 表情-->
			<!-- <div class="emoji" :class="{notDisplay: isemoji}">
				<div class="emoji-send">
					<div class="emoji-send-det">删除</div>
					<div class="emoji-send-btn">发送</div>
				</div>
				<emoji @emotion="emotion" :height="260"></emoji>
			</div> -->
			<!-- more -->
			<div class="more" :class="{notDisplay: ismore}">
				<div class="more-list" @tap="sendImg('album')">
					<image src="../../../static/images/submit/pic.png"></image>
					<div class="more-list-title">图片</div>
				</div>
				<div class="more-list" @tap="sendImg('camera')">
					<image src="../../../static/images/submit/pz.png"></image>
					<div class="more-list-title">拍照</div>
				</div>
				<div class="more-list" @tap="chooseLocation">
					<image src="../../../static/images/submit/wz.png"></image>
					<div class="more-list-title">定位</div>
				</div>
				<div class="more-list">
					<image src="../../../static/images/submit/wj.png"></image>
					<div class="more-list-title">文件</div>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
	// import emoji from './emoji/emoji.vue'
	export default {
		data() {
			return {
				// isrecord: false,
				// tabPic: '../../static/images/submit/yy.png',
				// isemoji: false,
				ismore: true,
				msg: '',
			}
		},
		components: {
			// emoji
		},
		methods: {
			// huo取高度
			getElementHeight() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.submit').boundingClientRect(data => {
					this.$emit('heights', data.height);
				}).exec();
			},
			// 点击切换音频
			// record() {
			// 	// 关闭其它项
			// 	this.ismore = true;
			// 	setTimeout(() => {
			// 		this.getElementHeight();
			// 	}, 10);
			// 	if (this.isrecord) {
			// 		this.isrecord = false;
			// 		this.tabPic = '../../static/images/submit/yy.png';
			// 	} else {
			// 		this.isrecord = true;
			// 		this.tabPic =  '../../static/images/submit/jp.png';
			// 	}
			// },
			// emoji() {
			// 	this.isemoji = !this.isemoji;
			// 	console.log('aa')
			// 	setTimeout(() => {
			// 		this.getElementHeight();
			// 	}, 10);
			// },
			// // Jieshou表情
			// emotion(e) {
			// 	console.log(e);
			// 	this.msg += e;
			// },
			// 文字发送
			inputs(e) {
				var mes = e.detail.value;
				var pos = mes.indexOf('\n');
				if (pos != -1 && mes.length > 1) {
					this.send(this.msg, 0);
				}
			},
			// 输入框聚焦
			focus() {
				// this.isemoji = true;
				setTimeout(() => {
					this.getElementHeight();
				}, 10)
			},
			
			// more
			moreFun() {
				this.ismore = !this.ismore;
				setTimeout(() => {
					this.getElementHeight();
				}, 10)
			},
			// fasong pic
			sendImg(e) {
				let count = 9;
				if (e == 'album') {
					count = 9;
				} else {
					count = 1;
				}
				uni.chooseImage({
					count: count,
					sizeType: ['original', 'compressed'],
					sourceType: [e],
					success:  (res) => {
						const filePaths = res.tempFilePaths;
						for (let i = 0; i < filePaths.length; i++) {
							this.send(filePaths[i], 1);
						}
					}
				})
			},
			chooseLocation() {
				uni.chooseLocation({
					// 箭头函数才可以找得到this
					success: (res) => {
						let data = {
							name: res.name,
							address: res.address,
							latitude: res.latitude,
							longitude: res.longitude
						}
						this.send(data, 3)
					}
				})
			},
			// 发送
			send(msg, types) {
				let data = {
					message: msg,
					types,
				}
				this.$emit('inputs', data);
				setTimeout(() => {
					this.msg = '';
				}, 0)
			}
		}
	}
</script>

<style lang="scss">
	.submit {
		background: rgba(244, 244, 244, 1);
		border-top: 1px solid $uni-border-color;
		width: 100%;
		
		
		position: fixed;
		bottom: 0;
		z-index: 99;
		padding-bottom: env(safe-area-inset-bottom);
	}
	.notDisplay {
		display: none;
	}
	.submit-chat {
		width: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: flex-end;
		padding: 10rpx 10rpx;
		image {
			width: 56rpx;
			height: 56rpx;
			margin: 0 10rpx;
			flex: auto;
		}
		.btn {
			flex: auto;
			padding: 20rpx;
			max-height: 160rpx;
			margin: 0 10rpx;
			background-color: #fff;
			border-radius: 10rpx;
		}
		
		.record {
			text-align: center;
			font-size: $uni-font-size-lg;
			color: $uni-text-color-grey;
		}
	}
	.emoji {
		height: 460rpx;
		width: 100%;
		background-color: rgba(230, 230, 237, 1);
		box-shadow: 0 -1rpx 0 0 rgba(0,0,0,.1);
		.emoji-send {
			width: 260rpx;
			height: 104rpx;
			padding-top: 24rpx;
			background-color: #999;
			position: fixed;
			bottom: env(safe-area-inset-bottom);
			right: 0;
			display: flex;
			.emoji-send-btn,
			.emoji-send-det {
				flex: 1;
				margin-left: 20rpx;
				border-radius: 12rpx;
				
				height: 60rpx;
				line-height: 48rpx;
				background-color: rgba(255, 220, 49, 1);
				font-size: 30rpx;
				text-align: center;
			}
		}	
	}
	
	.more {
		height: 436rpx;
		width: 100%;
		background-color: rgba(230, 230, 237, 1);
		box-shadow: 0 -1rpx 0 0 rgba(0,0,0,.1);
		bottom: env(safe-area-inset-bottom);
		padding: 5rpx 20rpx;
		box-sizing: border-box;
		.more-list {
			width: 25%;
			text-align: center;
			float: left;
			padding-top: 32rpx;
			image {
				width: 72rpx;
				height: 72rpx;
				padding: 24rpx;
				background-color: rgba(255,255,255,1);
				border-radius: 24rpx;
			}
			.more-list-title {
				font-size: 24rpx;
				color: raba(39,40,50,.5);
				line-height: 34rpx;
			}
		}
	}
	
</style>
