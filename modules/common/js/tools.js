Array.prototype.contains = function (val) { 
　　for (var i = 0; i < this.length; i++) { 
　　if (this[i] == val) { 
　　	return true; 
    } 
  } return false; 
} ;
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
/**
 * 日期格式化
 * 
 * @param format 格式化模式串
 * @returns 格式化后字符串
 */
Date.prototype.format = function(format){
	 var o = {
		  "M+" : this.getMonth()+1,  //month
		  "d+" : this.getDate(),     //day	
		  "h+" : this.getHours(),    //hour
	      "m+" : this.getMinutes(),  //minute
	      "s+" : this.getSeconds(), //second
	      "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
	      "w+" : this.getDay(), //week
	      "S"  : this.getMilliseconds() //millisecond
	   };
	 
	   if(/(y+)/.test(format)) {
	    format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	   }

	   for(var k in o) {
	    if(new RegExp("("+ k +")").test(format)) {
	      format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
	    }
	   }
	 return format;
};

/**
 * 格式化日期为yyyy-MM-dd格式
 * @param value
 * @returns {String}
 */
function formatDateYYYYMMDD(value){  
	if (!value) {
		return '';
	}
	
    var result='';
    try {
    	if ((typeof value) == "number"){  
    		result = new Date(value).format("yyyy-MM-dd");
    	}else{
    		result = new Date(Date.parse(value)).format("yyyy-MM-dd");
    	}
    } catch (e) {
    	return '';
    }
    return result;
};


/** 
	toolsModule
	---------------------------------------------------
	getDate            20151112 ===》2015/11/12
	getDate1           20151112 ===》2015.11.12
	getDate2           20151112 ===》2015-11-12
	getDate3           2015-11-12 ===》20151112
	getMD              20150912 ===》9月12日
	getYM              2015-09-12 ===》2016年9月12日
	getYMD             2015-09-12 ===》2016年9月12日 
	getSYM             201609 ===》2016年9月
	getDateFormat      20151112 ===》11-12
	---------------------------------------------------
	timeChange         ==》各地区时间转换
	isBlankObj         ==》判断是否为空
	transferCurrency   ==》转化金钱为人民币
	json2str           ==》json对象转字符串形式
	---------------------------------------------------
	getUrlParam        ==》获取url参数
	---------------------------------------------------
	storageSave        ==》本地存储-保存
	storageLoad        ==》本地存储-读取
	storageRemove      ==》本地存储-移除
	---------------------------------------------------
	form              ==》form美化开关
	---------------------------------------------------
	

 **/
var tools = function(){
	function getDate(date) {
	    return '' + date.slice(0, 4) + "/" + date.slice(4, 6) + '/' + date.slice(6, 8);
	}
	function getDate1(date) {
	    return '' + date.slice(0, 4) + "." + date.slice(4, 6) + '.' + date.slice(6, 8);
	}
	function getDate2(date) {
	    return '' + date.slice(0, 4) + "-" + date.slice(4, 6) + '-' + date.slice(6, 8);
	}
	function getDate3(date){
		return date.replace(/\-/g, "");
	}
	function getMD(date) {
	    var tmpDate = date.slice(4);
	    var mon = tmpDate.slice(0, 2);
	    var day = tmpDate.slice(2);
	    if (mon.slice(0, 1) == 0) {
	        if (day.slice(0, 1) == 0) {
	            var date = '' + tmpDate.slice(1, 2) + '月' + tmpDate.slice(3) + '日';
	        } else {
	            var date = '' + tmpDate.slice(1, 2) + '月' + tmpDate.slice(2) + '日';
	        }
	    } else {
	        if (day.slice(0, 1) == 0) {
	            var date = '' + tmpDate.slice(0, 2) + '月' + tmpDate.slice(3) + '日';
	        } else {
	            var date = '' + tmpDate.slice(0, 2) + '月' + tmpDate.slice(2) + '日';
	        }
	    }
	    return date;
	}
	function getYMD(date) {
	    var year = date.slice(0,4);
	    var mon = date.slice(5,7);
	    var day = date.slice(8);
	    if (mon.slice(0, 1) == 0) {
	        if (day.slice(0, 1) == 0) {
	            var date = '' + year + '年' + date.slice(6,7) + '月' + date.slice(9) + '日';
	        } else {
	            var date = '' + year + '年' + date.slice(6,7) + '月' + date.slice(8) + '日';
	        }
	    } else {
	        if (day.slice(0, 1) == 0) {
	            var date = '' + year + '年'  + date.slice(5,7) + '月' + date.slice(9) + '日';
	        } else {
	            var date = '' + year + '年'  + date.slice(5,7) + '月' + date.slice(8) + '日';
	        }
	    }
	    return date;
	}
	function getYM(date) {
	    var year = date.substring(0, date.indexOf("年"));
	    var month = date.substring(date.indexOf("年") + 1, date.indexOf("月"));
	    if (month < 10) {
	        month = "0" + month;
	    }
	    return '' + year + '' + month;
	}
	function getSYM(date){
		var year = date.slice(0,4);
		var month = date.slice(4,6);
		if(month.slice(0,1)*1 == 0){
			month = month.slice(1,2);
		}
	    return '' + year + '年' + month + '月';
	}
	function getDateFormat(date){
	    var tmpDate = date.slice(4);
	    return '' + tmpDate.slice(0,2) + '-' + tmpDate.slice(2);
	}
	/**
	 * 各地区时间的转换（由各地区的北京时间转换为所在地区的时间--查询结果中展开中地区时间轴使用）
	 * 法一：所求地区时间 = 该地区时间 +- 时区差*1小时
	 * 法二：所求地区时间 = 该地区时间 +- 经度差*4分钟
	 * 注：时区差 = 经度差（经度A - 经度B）/15
	 * eg：东经120度（东八区）  西经60度（西四区）   东经为+  西经为-
	 * 		[120-（-60）]/15 = 12时区
	 * ps:北京的经度是 116.5833度
	 * **/
	function timeChange(time,longitude){
		var time = time + (116.5833 - longitude)/15;
		if(time > 24){
			time = time - 24;
		}
		return Math.ceil(time);  //向上取整
	}
	function isBlankObj(obj){
	    if(obj==null || obj == false || obj == undefined|| obj == "undefined" || obj == "" || jQuery.isEmptyObject(obj)){
	        return true;
	    }
	    return false;
	}
	function transferCurrency(money){
		return parseInt(6.4856 * money);
		//var money = parseInt(money);
		//return parseFloat(6.4856 * money).toFixed(2);
	}
	function getUrlParam(name) {
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	    if (r != null) return unescape(r[2]); return null; //返回参数值
	}
	/**json对象转字符串形式 :对象作为参数传递时，如有字符串拼接操作，将会调用其默认的toString()方法，这样的字符串形式是："[Object]"，
	也就是错误出现的原因。解决办法：编写自己的json转String 的js代码，将contact正确转换就一切OK了。会报：missing ] after element list **/
	function json2str(o) {
	    var arr = [];
	    var fmt = function (s) {
	        if (typeof s == 'object' && s != null) return json2str(s);
	        return /^(string|number)$/.test(typeof s) ? '\'' + s + '\'' : s;
	    };
	    for (var i in o) arr.push('\'' + i + '\':' + fmt(o[i]));
	    return '{' + arr.join(',') + '}';
	}
	function storageSave(objectData) {
		sessionStorage.setItem(objectData.Name,JSON.stringify(objectData));
	}
	function storageLoad(objectName) {
		if(sessionStorage.getItem(objectName)){
			return JSON.parse(sessionStorage.getItem(objectName))
		}else{
			return false
		}
	}
	function storageRemove(objectName){
		sessionStorage.removeItem(objectName);
	}
	function tabs(id,flag){
		var _flag = flag;
		//init
		$(id).find(".tabsBtn a").eq(_flag).addClass("active").siblings().removeClass("active");
		$(id).find(".tabsContent>div").eq(_flag).addClass("active").siblings().removeClass("active");
		//event
		$(id).find(".tabsBtn").on("click","a",function(){
			var _this = $(this);
			var _index = _this.index();
			$(this).addClass("active").siblings().removeClass("active");
			$(id).find(".tabsContent>div").eq(_index).addClass("active").siblings().removeClass("active");
		});
	}
	function toolbar(id){
		var _id = id;
		var _btn = $(_id).find(".box .btn");
		$(_btn).click(function(){
			$(_id).toggleClass("active");
		});
	}
	return {
		getDate:getDate,
		getDate1:getDate1,
		getDate2:getDate2,
		getDate3:getDate3,
		getMD:getMD,
		getYM:getYM,
		getYMD:getYMD,
		getSYM:getSYM,
		getDateFormat:getDateFormat,
		timeChange:timeChange,
		isBlankObj:isBlankObj,
		getUrlParam:getUrlParam,
		transferCurrency:transferCurrency,
		json2str:json2str,
		storageSave:storageSave,
		storageLoad:storageLoad,
		storageRemove:storageRemove,
		tabs:tabs,
		toolbar:toolbar,
	}
}();

