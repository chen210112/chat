<template>
	<view class="emoji" :style="{height: height + 'px'}">
		<div class="emoji-line" v-for="(line, i) in emoji" :key="i">
			<div @tap="clickEmoji(item)" class="emoji-line-item" v-for="(item, index) in line" :key="index">{{item}}</div>
		</div>
	</view>
</template>

<script>
	export default {
		props: {
			height: {
				type: Number,
				default: 260
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			clickEmoji(e) {
				this.$emit('emotion', e)
			}
		}
	}
</script>

<style lang="scss">
	.emoji {
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx;
		overflow: hidden;
		overflow-y: auto;
		.emoji-line {
			display: flex;
			.emoji-line-item {
				flex: 1;
				justify-content: space-between;
				text-align: center;
				font-size: 20px;
				line-height: 1.5;
			}
		}
	}

</style>
