/****************url参数获取 BEGIN*****************/
//根据QueryString参数名称获取值 
function getQueryString() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r != null) {
		return unescape(r[2]);
	} else {
		return null;
	}
};
/****************url参数获取 END*****************/


/** 子iframe在父中添加iframe begin **/
function getOutWidth(l){
    var k=0;
	$(l,window.parent.document).each(function(){
        k+=$(this).outerWidth(true)
    });
	return k
}
function openTab(url,title){
    var m=$(this).data("index"),k=true;
	var o=url;
	if(title!=undefined&&title!=''){
		l = title;
	}else{
		l = $.trim($(this).text());
	}
    if(o==undefined||$.trim(o).length==0){
        return false
    }
	var oId = o.substring(0,o.indexOf("?"));
    $(".J_menuTab",window.parent.document).each(function(){
		
		if($(this).data("id")==oId){
			console.log($(this).data("id"));
			if(!$(this).hasClass("active")){
				$(this).addClass("active").siblings(".J_menuTab").removeClass("active");
				tg(this);
				$(".J_mainContent .J_iframe",window.parent.document).each(function(){
					if($(this).data("id")==oId){
						var oldSrc=$(this).attr('src');
						$(this).show().siblings(".J_iframe").hide();
						if(!(oldSrc==o)){//加载地址变化 重新刷新
							$(this).attr('src',o);
						}
						return false
					}
				})
			}
			k=false;
			return false
		}
    });
	if(k){	
        var p='<a href="javascript:;" class="active J_menuTab" data-id="'+oId+'">'+l+' <i class="fa fa-times-circle"></i></a>';
		$(".J_menuTab",window.parent.document).removeClass("active");
        var n='<iframe class="J_iframe" name="iframe'+m+'" width="100%" height="100%" src="'+o+'" frameborder="0" data-id="'+oId+'" seamless></iframe>';
        $(".J_mainContent",window.parent.document).find("iframe.J_iframe").hide().parents(".J_mainContent").append(n);
        $(".J_menuTabs .page-tabs-content",window.parent.document).append(p);
		tg($(".J_menuTab.active",window.parent.document))
    }
    return false
}

function tg(n){
    var o=getOutWidth($(n).prevAll()),q=getOutWidth($(n).nextAll());
    var l=getOutWidth($(".content-tabs",window.parent.document).children().not(".J_menuTabs"));
    var k=$(".content-tabs",window.parent.document).outerWidth(true)-l;
    var p=0;
    if($(".page-tabs-content",window.parent.document).outerWidth()<k){
		p=0
	}else{
		if(q<=(k-$(n).outerWidth(true)-$(n).next().outerWidth(true))){
            if((k-$(n).next().outerWidth(true))>q){
                p=o;
                var m=n;
                while((p-$(m).outerWidth())>($(".page-tabs-content",window.parent.document).outerWidth()-k)){
                    p-=$(m).prev().outerWidth();
                    m=$(m).prev()
                }
            }
        }else{
            if(o>(k-$(n).outerWidth(true)-$(n).prev().outerWidth(true))){
                p=o-$(n).prev().outerWidth(true)
            }
        }
    }
    $(".page-tabs-content",window.parent.document).animate({marginLeft:0-p+"px"},"fast")
}
/** 子iframe在父中添加iframe end **/

/***************loading BEGIN****************/
// loading 框
function ajaxLoading(){
	var html = '<div id="loading" class="loadingWrapper"><div class="loadingBox"><div class="loadEffect">'+
        	'<span></span><span></span><span></span><span></span><span></span>'+
        '</div>加载中...</div></div>';
	$("body").append(html);
}
//关闭覆盖层 loading
function closeAjaxLoading() {
	//layer.closeAll();
	$("#loading").remove();
}
//loading 框
function ajaxSubmitting(){
	var html = '<div id="submitting" class="loadingWrapper"><div class="loadingBox"><div class="loadEffect">'+
        	'<span></span><span></span><span></span><span></span><span></span>'+
        '</div>提交中...</div></div>';
	$("body").append(html);
}
//关闭覆盖层 loading
function closeAjaxSubmitting() {
	//layer.closeAll();
	$("#submitting").remove();
}
/***************loading END****************/

/*************** token  BEGIN ****************/
//取token
function getToken(){
	var _data = tools.storageLoad("userInfo");
	console.log(_data);
	var token = ""; 
	if(_data && _data.data && _data.data.data){
		token = _data.data.data.token;
	}
	return token;
	/*
	if(token){
		return token;
	}else{
		console.log("token不存在");
	}
	*/
}
function getUserInfo(){
	var _data = tools.storageLoad("userInfo");
	
	if(_data!=false){
		return _data.data.data;
	}
}
/*************** token  END ****************/


/*****************页面跳转 BEGIN*****************/
//迁移页面
function linkTo(url){
	window.location.href = url;
}
//打开Tab页
function linkToTab(title, url) {
	var $target = window.top.$('#__tab_link_hidden');
	if ($target.size() > 0) {
		$target.attr('href', url);
		$target.text(title);
		$target.click();
	}
}
/*****************页面跳转 END*****************/

/*****************ajax调用异常处理 BEGIN*****************/
function handleError(message){
	console.log(message);
	var status = message.status;
	var response = message.responseJSON;
	if(status==400){
		handleBadRequest(response);
	}else if(status==401){
		handleAuthenticationError(response);
	}else if(status==403){
		handleAuthorizeError(response);
	}else if(status==404){
		handleNotFound(response);
	}
}
function handleBadRequest(response){
	if(swal instanceof Function){
		swal("失败","请求异常,请重试","error");
	}else{
		alert("请求异常,请重试");
	}
}
function handleAuthenticationError(response){
	if(swal instanceof Function){
		swal("失败","请重新登录认证","error");	
	}else{
		alert("请重新登录认证");
	}
}
function handleAuthorizeError(response){
	if(swal instanceof Function){
		swal("失败","您没有此权限,请联系系统管理员","error");	
	}else{
		alert("您没有此权限,请联系系统管理员");
	}
}
function handleNotFound(response){
	if(swal instanceof Function){
		swal("失败","您访问的资源已经不存在","error");	
	}else{
		alert("您访问的资源已经不存在");
	}
}
/*****************ajax调用异常处理 END*****************/

//筛选插件
var filterBox = function(){
	function init(id){
		event(id);
	}
	function event(id){
		var leftData = $(id).find(".leftData ul")
		var rightData = $(id).find(".rightData ul")
		//单击多选
		$(id).find(".leftData ul,.rightData ul").on("click","li",function(){
			$(this).toggleClass("active")
		});
		//右移
		$(id).find(".rightBtn").on("click",function(){
			var selectData = leftData.find("li.active");
			selectData.remove();
			selectData.removeClass("active")
			rightData.append(selectData);
		});
		//左移
		$(id).find(".leftBtn").on("click",function(){
			var selectData = rightData.find("li.active");
			selectData.remove();
			selectData.removeClass("active")
			leftData.append(selectData);
		});
	}
	function returnData(id){
		var li = $(id).find(".rightData ul li");
		var newData = [];
		li.each(function(){
			var param = $(this).attr("data-param");
			newData.push(param);
		  });
		console.log(newData)
		return newData;
	}
	return{
		init:init,
		returnData:returnData
	}
}()