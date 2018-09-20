//var app = window.app || window.parent.app || window;
function getAppConfig(window){//获取配置文件
	if(window.app==undefined&&window.parent!=undefined){
		return getAppConfig(window.parent);
	}else if(window.app!=undefined){
		return window.app;
	}
}
var app = getAppConfig(window);
if(app==undefined){
	console.log("配置文件出错")
}else if(app.client==undefined){
	console.log("配置文件 没有配置应用上下文");
}else if(app.server==undefined){
	console.log("配置文件 没有配置服务上下文");
}

document.writeln('	  <!--[if lt IE 9]> ');
document.writeln('    <meta http-equiv="refresh" content="0;ie.html" />');
document.writeln("    <![endif]-->");
//document.writeln("    <link rel=\'shortcut icon\' href=\'favicon.ico\'>");
document.writeln('    <link href="'+  app.client.config.contextPath +'css/bootstrap.min.css" rel="stylesheet">');
document.writeln('    <link href="'+  app.client.config.contextPath +'css/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">');
document.writeln('    <link href="'+  app.client.config.contextPath +'css/plugins/dataTables/jquery.dataTables.css" rel="stylesheet">');
document.writeln('    <link href="'+  app.client.config.contextPath +'css/plugins/sweetalert/sweetalert.css" rel="stylesheet">');
document.writeln('    <link href="'+  app.client.config.contextPath +'css/plugins/datetimepicker/bootstrap-datetimepicker.min.css" rel="stylesheet">');

document.writeln('    <link href="'+  app.client.config.contextPath +'css/plugins/validate/bootstrapValidator.css" rel="stylesheet">');
document.writeln('    <link href="'+  app.client.config.contextPath +'css/font-awesome.min93e3.css?v=4.4.0" rel="stylesheet">');
document.writeln('    <link href="'+  app.client.config.contextPath +'css/animate.min.css" rel="stylesheet">');
document.writeln('    <link href="'+  app.client.config.contextPath +'css/style.min862f.css?v=4.1.0" rel="stylesheet">');
document.writeln('	  <link href="'+  app.client.config.contextPath +'css/bootstrap-switch.min.css" rel="stylesheet">');

document.writeln('	  <link href="'+  app.client.config.contextPath +'css/main.css" rel="stylesheet">');
document.writeln("<!--==========================css end============================-->");

document.writeln('    <script src="'+  app.client.config.contextPath +'js/jquery.min.js"></script>');
document.writeln('    <script src="'+  app.client.config.contextPath +'js/bootstrap.min.js"></script>');
//document.writeln("    <script src=\'"+  app.client.config.contextPath +"/js/plugins/bootstrap-table/bootstrap-table.min.js\'></script>");
//document.writeln('    <script src="'+  app.client.config.contextPath +'js/plugins/jsTree/jstree.min.js"></script>');

document.writeln('    <script src="'+  app.client.config.contextPath +'js/plugins/treeview/bootstrap-treeview.js"></script>');
document.writeln('    <script src="'+  app.client.config.contextPath +'js/plugins/sweetalert/sweetalert.min.js"></script>');
document.writeln('    <script src="'+  app.client.config.contextPath +'js/plugins/datetimepicker/bootstrap-datetimepicker.min.js"></script>');
document.writeln('    <script src="'+  app.client.config.contextPath +'js/plugins/datetimepicker/bootstrap-datetimepicker.zh-CN.js"></script>');
//add end
//document.writeln('    <script src="'+  app.client.config.contextPath +'js/plugins/dataTables/dataTables.bootstrap.js"></script>');
document.writeln('    <script src="'+  app.client.config.contextPath +'js/plugins/dataTables/jquery.dataTables.js"></script>');
//document.writeln('    <script src="'+  app.client.config.contextPath +'js/plugins/select2/js/select2.js"></script>');

//document.writeln('    <script src="'+  app.client.config.contextPath +'js/plugins/bootstrapWizard/jquery.bootstrap.wizard.js"></script>');

document.writeln('    <script src="'+  app.client.config.contextPath +'js/plugins/metisMenu/jquery.metisMenu.js"></script>');
document.writeln('    <script src="'+  app.client.config.contextPath +'js/plugins/slimscroll/jquery.slimscroll.min.js"></script>');

document.writeln('    <script src="'+  app.client.config.contextPath +'js/plugins/layer/layer.min.js"></script>');
document.writeln('    <script src="'+  app.client.config.contextPath +'js/hplus.min.js?v=4.1.0"></script>');
document.writeln('    <script src="'+  app.client.config.contextPath +'js/contabs.min.js"></script>');
document.writeln('    <script src="'+  app.client.config.contextPath +'js/plugins/pace/pace.min.js"></script>');

document.writeln('    <script src="'+  app.client.config.contextPath +'js/bootstrap-switch.min.js"></script>');

document.writeln('    <script src="'+  app.client.config.contextPath +'modules/common/js/tools.js"></script>');
document.writeln('    <script src="'+  app.client.config.contextPath +'modules/common/js/common.js"></script>');
//document.writeln('    <script src="'+  app.client.config.contextPath +'modules/common/js/dictionary.js"></script>');
document.writeln('    <script src="'+  app.client.config.contextPath +'js/token.js"></script>');
document.writeln("<!--==========================js end============================-->");


//国际化初始化
app.client.i18n();
