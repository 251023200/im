/**
 * 系统配置
 */
var app={};
/**
 * 客户端配置
 */
app.client = app.client || {

	/**
	 * 全局配置信息
	 */
	config : {
		contextPath : "/",	//前端静态页面上下文路径
		pageNo : 0,
		pageLength : 10,
	},

	
	/**
	 * 国际化初始化
	 */
	i18n : function(){	
		var locale = localStorage.getItem('csscLease.locale');
		if (!locale) {
			locale = 'zh-CN';
			localStorage.setItem('csscLease.locale', locale);
		}
	}
};

app.server={
	apiGateway : "http://127.0.0.1/api",
	//oauth : "http://127.0.0.1/oauth",
	oauth: "http://127.0.0.1/auth",
	auth : "http://127.0.0.1/auth",
	file : "http://127.0.0.1/file",
	resource : "http://127.0.0.1:8000", //静态资源
};
