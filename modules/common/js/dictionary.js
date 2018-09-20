/**
 * 数据字典工具类
 * 
 */
var dictionary = function(){
	
	var typeCode = {
			process_type : "process_type",// 币种
			samples_status:'samples_status',//标本状态
			pregnantInfo:'pregnantInfo',//怀孕情况
			liuchanInfo:'liuchanInfo',//流产情况
			fayuInfo:'fayuInfo',//发育情况
			brithQuexian:'brithQuexian',//出生缺陷
			yaozheInfo:'yaozheInfo',//夭折情况
		
	}
	
	var _cacheData ={}

	function loadDict(typeCode, callback, errorCallback){
		
		if(dictionary._cacheData[typeCode] && typeof callback === "function"){
			callback(dictionary._cacheData[typeCode] ); 
			return;
		}
		console.log(typeCode);
		/**
		 * 加载数据字典
		 */
		$.ajax({
			type : "POST",
			dataType : "JSON",
			url : appConfig.constant.host +  "/sdictionary/list?code=" +  typeCode,
			data : {
				"token" : getToken()
			},
			//beforeSend : ajaxLoading,
			error : function(request) {
				if (errorCallback && typeof errorCallback === "function"){
					errorCallback(request); 
		        }else{
					// 关闭弹出的窗
					closeAjaxLoading();
		        }
			},
			success : function(data) {
				dictionary._cacheData[typeCode]= data;
				
				if (callback && typeof callback === "function"){
		            callback(data); 
		        }
			},
			complete : function() {
				// 关闭弹出的窗
				//closeAjaxLoading();
			}
		});
	}
	
	function loadMoreDict(typeCode, callback, errorCallback){
		
		if(dictionary._cacheData[typeCode] && typeof callback === "function"){
			callback(dictionary._cacheData[typeCode] ); 
			return;
		}
		
		/**
		 * 加载数据字典
		 */
		$.ajax({
			type : "POST",
			dataType : "JSON",
			url : appConfig.constant.host +  "/dict/listmore?dictCode=" +  typeCode,
			data : {
				"token" : getToken()
			},
			//beforeSend : ajaxLoading,
			error : function(request) {
				if (errorCallback && typeof errorCallback === "function"){
					errorCallback(request); 
		        }else{
					// 关闭弹出的窗
					closeAjaxLoading();
		        }
			},
			success : function(data) {
				var strs= new Array(); //定义一数组
				strs=typeCode.split(","); //字符分割
				for (i=0;i<strs.length ;i++ ){
					dictionary._cacheData[strs[i]]= data[strs[i]];
				} 
				//dictionary._cacheData[typeCode]= data;
				
				if (callback && typeof callback === "function"){
		            callback(data); 
		        }
			},
			complete : function() {
				// 关闭弹出的窗
				//closeAjaxLoading();
			}
		});
	} 
	
	function formatCode(typeCode, dictCode){
		var items  = dictionary._cacheData[typeCode];
		var local = getLocale();
		
		var value = "";
		if(items){
			for(var i = 0; i < items.length; i++){
				if(items[i].dictCode == dictCode){
					if(local === "en"){
						return items[i].dictValueEn;
					}else if(local === "'zh-HK"){
						return items[i].dictValueZhHk;
					}else{
						return items[i].dictValueZhCn;
					}
				}
			}
		}
		
		return value;
	}
	
	function bindSelect(ctrlName, typeCode, placeholderText, value) {
		  var control = $(ctrlName);
		
		  //加载数据字典
		  dictionary.loadDict(typeCode, function (data) {
			  console.log(typeCode);
			  console.log("-------------dirct");
			  console.log(data);
		    control.empty();//清空下拉框
		    control.append("<option value=''>" + placeholderText + "</option>");
		    $.each(eval(data), function (i, item) {
				if(item.dictCode==value)
				{
				    control.append("<option value='" + item.dictCode + "' selected='selected' >" +  dictionary.formatCode(typeCode, data[i].dictCode)  + "</option>");
				 }else{
				    control.append("<option value='" + item.dictCode + "'>" + dictionary.formatCode(typeCode, data[i].dictCode)  + "</option>");
				}
		    });
		  });
	};
		
	function init(){
		
		// 此方法会把数据缓存到localStorage,适用于数据不会变化的数据
		var toInitTypeCode = dictionary.typeCode.currency;
		var dictTypeData = localStorage.getItem('csscLease.dictionary.'+toInitTypeCode);
		if(dictTypeData){
			dictionary._cacheData[toInitTypeCode]= JSON.parse(dictTypeData);
		}else{
			dictionary.loadDict(dictionary.typeCode.currency, function(data ){
				localStorage.setItem('csscLease.dictionary.'+toInitTypeCode, JSON.stringify(data ));
			});
		}
	}
	
	return{
		loadDict : loadDict,
		loadMoreDict : loadMoreDict,
		formatCode:formatCode,
		typeCode:typeCode,
		init: init,
		_cacheData:_cacheData,
		bindSelect :bindSelect
	}
}();

dictionary.init();
