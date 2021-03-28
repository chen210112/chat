export default {
	// 首页时间转化
	dateTime: function(d) {
		let old = new Date(d);
		let now = new Date();
		
		let time = old.getTime();
		let hour = old.getHours();
		let minute = old.getMinutes();
		let year = old.getFullYear();
		let month = old.getMonth() + 1;
		let day = old.getDate();
		
		let nTime = now.getTime();
		let nHour = now.getHours();
		let nMinute = now.getMinutes();
		let nYear = now.getFullYear();
		let nMonth = now.getMonth() + 1;
		let nDay = now.getDate();
		
		// 当天时间
		if(day === nDay && month === nMonth && year === nYear) {
			if (hour < 10) {
				hour = '0' + hour;
			}
			if (minute < 10) {
				minute = '0' + minute;
			} 
			return hour + ':' + minute;
		} else if (day + 1 === nDay && month === nMonth && year === nYear) {
			// 昨天时间
			if (hour < 10) {
				hour = '0' + hour;
			}
			if (minute < 10) {
				minute = '0' + minute;
			}
			return '昨天' + hour + ':' + minute;
		} else {
			// 前天及更早
			return year + '/' + month + '/' + day;
		}
			
	},
	// 聊天页面时间转化
	dateTimeChat: function(d) {
		let old = new Date(d);
		let now = new Date();
		
		let time = old.getTime();
		let hour = old.getHours();
		let minute = old.getMinutes();
		let year = old.getFullYear();
		let month = old.getMonth() + 1;
		let day = old.getDate();
		
		let nTime = now.getTime();
		let nHour = now.getHours();
		let nMinute = now.getMinutes();
		let nYear = now.getFullYear();
		let nMonth = now.getMonth() + 1;
		let nDay = now.getDate();
		
		// 当天时间
		if(day === nDay && month === nMonth && year === nYear) {
			if (hour < 10) {
				hour = '0' + hour;
			}
			if (minute < 10) {
				minute = '0' + minute;
			} 
			return hour + ':' + minute;
		} else if (day + 1 === nDay && month === nMonth && year === nYear) {
			// 昨天时间
			if (hour < 10) {
				hour = '0' + hour;
			}
			if (minute < 10) {
				minute = '0' + minute;
			}
			return '昨天' + hour + ':' + minute;
		} else {
			// 前天及更早
			return year + '/' + month + '/' + day + ' ' + hour + ':' + minute;
		}
			
	},
	// 间隔时间
	jiangeTime(past, now) {
		past = new Date(past);
		now  = new Date(now);
		var pastT = past.getTime();
		var nowT = now.getTime();
		
		if (nowT > (pastT + 1000*60*3) ) {
			return now;
		} else {
			return '';
		}
	},
	// 详情时间转换
	detailTime: function(d) {
		let old = new Date(d);
		
		let time = old.getTime();
		let hour = old.getHours();
		let minute = old.getMinutes();
		let year = old.getFullYear();
		let month = old.getMonth() + 1;
		let day = old.getDate();
		
		if (month < 10) {
			month = '0' + month;
		}
		if (hour < 10) {
			hour = '0' + hour;
		}
		if (minute < 10) {
			minute = '0' + minute;
		}
		return year + '-' + month + '-' + day;
	},
	// 文件夹名
	fileName: function(d) {
		let old = new Date(d);
		
		let time = old.getTime();
		let hour = old.getHours();
		let minute = old.getMinutes();
		let year = old.getFullYear();
		let month = old.getMonth() + 1;
		let day = old.getDate();
		
		if (month < 10) {
			month = '0' + month;
		}
		if (hour < 10) {
			hour = '0' + hour;
		}
		if (minute < 10) {
			minute = '0' + minute;
		}
		return year + month + day;
	},
	
	// 搜索延时作用
	debounce(fn, t) {
		let delay = t || 500;
		let timer;
		return function() {
			let args = arguments;
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(() => {
				timer = null;
				fn.apply(this, args);
			}, delay);
		}
	},
	
	// 对象数组根据某个键进行排序
	mySort(arr, key, order) {
		if (order === 1) {
			// 升序
			for (let i = 1; i < arr.length; i++) {
				for (let j = i; j > 0; j--) {
					if (arr[j][key] < arr[j - 1][key]) {
						let temp = arr[j];
						arr[j] = arr[j - 1];
						arr[j - 1] = temp;
					}
				}
			}
		} else {
			// 降序
			for (let i = 1; i < arr.length; i++) {
				for (let j = i; j > 0; j--) {
					if (arr[j][key] > arr[j - 1][key]) {
						let temp = arr[j];
						arr[j] = arr[j - 1];
						arr[j - 1] = temp;
					}
				}
			}
		}
		return arr;
	}
	
}