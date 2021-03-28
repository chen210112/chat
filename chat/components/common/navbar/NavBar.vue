<template>
  <div class="nav-bar">
    <div class="left">
      <slot name="left"></slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
	<div class="center">
	  <slot name="center"></slot>
	</div>
  </div>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<style>
	.nav-bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 99;
		/* padding-top: var(--status-bar-height); */
		padding: 0 40rpx;
		/* border: 1px solid red; */
		height: 88rpx;
		background: $uni-bg-color;
		box-shadow: 0px 1px 0px rgba(0,0,0,0.1);
	}
		.left {
			/* float: left; */
			position: absolute;
			height: 100%;
			width: 80%;
			/* border: 2rpx solid red; */
		}
		 /* 创建图片垂直居中的环境 */
		.left:after {
			content: 'center';
			display: inline-block;
			/* 撑起整个linebox的高度，要比图片高度大 */
			height: 100%;
			 /* 有inline内容但overflow不是visible，其基线为下边缘 */
			overflow: hidden;
			 /* 还有一个作用就是配合width为0使得内容不会溢出 */
			width: 0;
			 /* 调整linebox的基线位置 */
			vertical-align: middle;
			 /* 方法2 */
			 /* content''相当于没有inline内容，所以该行内块的基线是其下边缘 */
			 /* content: ''; */
			 /* 只要设置为''，一使得基线为下边缘，二也不占宽。所以就可以省去overflow：hidden和width: 0 */
		}
		.center {
			/* border: 2px solid green; */
			text-align: center;
			/* position: absolute; */
			/* 很奇怪，该绝对定位元素竟然不以父元素的内边距为定位点 */
			/* left: 0;
			right: 0; */ 
			width: 60%;
			margin: 0 auto;
			z-index: -99;
		}
		.center:after {
			content: '';
			line-height: 88rpx;
			vertical-align: middle;
		}
		.right:after {
			content: '';
			line-height: 88rpx;
			vertical-align: middle;
		}
		.right {
			/* border: 1rpx solid red; */
			float: right;
		}
    
</style>