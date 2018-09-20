$(function(){
	initData();
	initUserInfo();//初始化用户基本信息
	initUserAvatar();//初始化用户头像
});
var SysUserModel={};
var originSelectedRoles=[];
var toSelectedRoles=[];
function initData(){//初始化数据
	SysUserModel.search={};
	SysUserModel.queryString=getQueryString();
}
function initUserInfo(id){//查看
	var id=SysUserModel.queryString['id'];
	var url=app.server.auth+"/users/{id}";
	url = url.replace("{id}",id);
	$.ajax({
		type:"GET",
		url:url,
		contentType:"application/json",
		//data:JSON.stringify(param),
		dataType:"json",
		headers:{
			"Authorization":"Bearer "+Token.getAccessToken(),
		},
		success:function(result){
			//console.log(result);
			if(result.code==0){
				showUserInfo(result.data);
			}
		},
		error:function(message){
			handleError(message);	
		}
	}); 
}
function showUserInfo(user){
	$('#userInfo #userNo').val(user.userNo);
	$('#userInfo #userName').val(user.userName);
	$('#userInfo #name').val(user.name);
	$('#userInfo #email').val(user.email);
	$('#userInfo #telephone').val(user.telephone);
	$('#userInfo #mobileTelephone').val(user.mobileTelephone);
}

function saveUser(){
	var userNo=$('#userInfoForm #userNo').val();
	var userName=$('#userInfoForm #userName').val();
	var name=$('#userInfoForm #name').val();
	var email=$('#userInfoForm #email').val();
	var telephone=$('#userInfoForm #telephone').val();
	var mobileTelephone=$('#userInfoForm #mobileTelephone').val();
	//var password=$('#userInfoForm #password').val();
	var id=SysUserModel.queryString['id'];
	var param={
		'userNo':userNo,
		'userName':userName,
		'name':name,
		'email':email,
		'telephone':telephone,
		'mobileTelephone':mobileTelephone
		//'password':password,
	};
	var url=undefined;
	var method=undefined;
	var isAddOp=false;
	url=app.server.auth+"/users/{id}";	//PUT url
	url=url.replace("{id}",id);
	method="PUT";
	console.log(method + " " + url);
	$.ajax({
		type:method,
		url:url,
		contentType:"application/json",
		data:JSON.stringify(param),
		dataType:"json",
		headers:{
			"Authorization":"Bearer "+Token.getAccessToken(),
		},
		success:function(result){
			
			var title='成功';
			var content='数据已修改';
			swal({
				'title': title,
				'text': content,
				'type':'success'
			},function(){//刷新
				
			});
			
			//businessCallback(result);
		},
		error:function(message){
			handleError(message);
		}
	}); 
}

var initUserAvatar=function(){
	var id=SysUserModel.queryString['id'];
	var url=app.server.file+"/attachments/bid/{id}";
	url = url.replace("{id}",id);
	$.ajax({
		type:"GET",
		url:url,
		contentType:"application/json",
		//data:JSON.stringify(param),
		dataType:"json",
		headers:{
			"Authorization":"Bearer "+Token.getAccessToken(),
		},
		success:function(result){
			console.log(result);
			if(result.code==0){
				//showUserInfo(result.data);
				//alert(result.data.path)
				var attachments = result.data;
				if(attachments.length>0){
					var attachment = attachments[0];
					saveFileId(attachment.id);
					showFile(attachment.path);
					//showAvatar(attachment);
				}
			}
		},
		error:function(message){
			handleError(message);
		}
	}); 
}

function showDefaultPicture(){
	var path = app.server.resource + '/image/default.jpg';
	$('#avatar').attr('src',path);
}

function saveFileId(id){
	$('#fileId').val(id);
}
function showFile(path){
	path = app.server.resource + '/image/'+ path+'?t='+Math.random();
	$('#avatar').attr('src',path);
}


/****上传附件****/
var FileInput=function(options){
	var oFile = new Object();
	oFile.fileinputDivId = options.fileinputDivId;
	oFile.uploadUrl = options.uploadUrl;
	oFile.initialPreview = options.initialPreview;
	oFile.callback = options.callback;
	oFile.init=function(fileinputDivId,uploadUrl,initialPreview,callback){
		if(fileinputDivId==undefined||fileinputDivId==null||fileinputDivId=='')fileinputDivId=this.fileinputDivId;
		if(uploadUrl==undefined||uploadUrl==null||uploadUrl=='')uploadUrl=this.uploadUrl;
		if(initialPreview==undefined||initialPreview==null||initialPreview=='')initialPreview=this.initialPreview;
		if(callback==undefined||callback==null||callback=='')callback=this.callback;
		var selector = $('#'+fileinputDivId);
		selector.fileinput({
			language: 'zh', //设置语言
			uploadUrl: uploadUrl, //上传的地址
			enctype: 'multipart/form-data',
			allowedFileExtensions : ['jpg', 'png','bmp','jpeg'],//接收的文件后缀
			showUpload: true, //是否显示上传按钮
			showRemove: false, //是否显示移除按钮
			showPreview: false,              //展前预览
			showCaption: true,//是否显示标题
			showClose: false,
			autoReplace: true,
			overwriteInitial: true, //不覆盖已存在的图片  
			showUploadedThumbs: false,	//选择若干个文件后点击右下角上传按钮批量上传，待全部完成后再选择一批文件，此时之前上传成功的文件是否要保存。就是这个属性控制的。
			//下面几个就是初始化预览图片的配置      
			//initialPreviewAsData: true,  
			//initialPreviewFileType: 'image',  
			//initialPreview:initialPreview , //要显示的图片的路径  
			//initialPreviewConfig:con   
			//minImageWidth: 50, //图片的最小宽度
			//minImageHeight: 50,//图片的最小高度
			//maxImageWidth: 1000,//图片的最大宽度
			//maxImageHeight: 1000,//图片的最大高度
			maxFileSize : 10000,//上传文件最大的尺寸
			//maxFilesNum : 1,//
			maxFileCount: 1,
			dropZoneEnabled: false,//是否显示拖拽区域
			browseClass: "btn btn-primary", //按钮样式
			uploadAsync: false,
			layoutTemplates :{
				actionDelete:'', //去除上传预览的缩略图中的删除图标
				actionUpload:'',//去除上传预览缩略图中的上传图片；
				actionZoom:''   //去除上传预览缩略图中的查看详情预览的缩略图标。
			},
			uploadExtraData:function (previewId, index) {
				//向后台传递id作为额外参数，是后台可以根据id修改对应的图片地址。
				var param = {};
				param.id = getFileId();
				param.bid = getBid();
				return param;
			}
		}).on("filebatchuploadsuccess", function(event, data) {
			callback(data.response);	//回调
		}).on('fileerror', function(event, data, msg) {  //一个文件上传失败
			console.log('文件上传失败！'+msg);
			console.log(data);
		});
	}
	oFile.upload=function(fileinputDivId){
		if(fileinputDivId==undefined||fileinputDivId==null||fileinputDivId=='')fileinputDivId=this.fileinputDivId;
		var selector = $('#'+fileinputDivId);
		selector.fileinput('upload');
	}
	/*
	oFile.refresh=function(initialPreview,fileinputDivId){
		if(fileinputDivId==undefined||fileinputDivId==null||fileinputDivId=='')fileinputDivId=this.fileinputDivId;
		var selector = $('#'+fileinputDivId);
		var uploadUrl = this.uploadUrl;
		selector.fileinput('refresh',{
			language: 'zh', //设置语言
			uploadUrl: uploadUrl, //上传的地址
			enctype: 'multipart/form-data',
			allowedFileExtensions : ['jpg', 'png','bmp','jpeg'],//接收的文件后缀
			showUpload: true, //是否显示上传按钮
			showRemove: false, //是否显示移除按钮
			showPreview: false,              //展前预览
			showCaption: true,//是否显示标题
			showClose: false,
			autoReplace: true,
			overwriteInitial: true, //不覆盖已存在的图片  
			showUploadedThumbs: false,	//选择若干个文件后点击右下角上传按钮批量上传，待全部完成后再选择一批文件，此时之前上传成功的文件是否要保存。就是这个属性控制的。
			//下面几个就是初始化预览图片的配置      
			initialPreviewAsData: true,  
			initialPreviewFileType: 'image',  
			//initialPreview:initialPreview , //要显示的图片的路径 
			//initialPreview:'http://127.0.0.1:8000/image/default.jpg',
			//initialPreviewConfig:{
			//	'url' : 'http://127.0.0.1:8000/image/default.jpg'
			//},   
			//minImageWidth: 50, //图片的最小宽度
			//minImageHeight: 50,//图片的最小高度
			//maxImageWidth: 1000,//图片的最大宽度
			//maxImageHeight: 1000,//图片的最大高度
			maxFileSize : 10000,//上传文件最大的尺寸
			//maxFilesNum : 1,//
			maxFileCount: 1,
			dropZoneEnabled: false,//是否显示拖拽区域
			browseClass: "btn btn-primary", //按钮样式
			uploadAsync: false,
			layoutTemplates :{
				actionDelete:'', //去除上传预览的缩略图中的删除图标
				actionUpload:'',//去除上传预览缩略图中的上传图片；
				actionZoom:''   //去除上传预览缩略图中的查看详情预览的缩略图标。
			},
			uploadExtraData:function (previewId, index) {
				//向后台传递id作为额外参数，是后台可以根据id修改对应的图片地址。
				var param = {};
				param.id = getFileId();
				param.bid = getBid();
				return param;
			},
			
			'initialPreview':'<img src="'+initialPreview+'" class="file-preview-image">',
		});
	}
	*/
	return oFile;
}

var fileinput=undefined;
function initAvatar(){
	var avatar={}
	var fileinputDivId='file';
	var uploadUrl=app.server.file+'/upload';
	if(avatar.path==undefined||avatar.path==null||avatar.path==''){
		var initialPreview="http://127.0.0.1:8000/image/default.jpg";
	}else{
		var initialPreview="http://127.0.0.1:8000/image/"+avatar.path;
	}
	var uploadFileCallback=function(response){
		var attachmentId = response.data.id;
		var attachmentPath = response.data.path;
		saveFileId(attachmentId);
		showFile(attachmentPath);
		
	}
	fileinput = FileInput({
		'fileinputDivId' : fileinputDivId,
		'uploadUrl' : uploadUrl,
		'initialPreview' : initialPreview,
		'callback' : uploadFileCallback
	});
	fileinput.init();
}
initAvatar();

function showAvatar(avatar){
	//var initialPreview="http://127.0.0.1:8000/image/"+avatar.path;
	//console.log(initialPreview)
	//fileinput.refresh(initialPreview);
	
}

function getFileId(){
	return $('#fileId').val();
}
function getBid(){
	var bid=SysUserModel.queryString['id'];	//为修改
	if(bid==undefined||bid==null||bid==''){//为新增
		return $('#businessId').val();
	}else{
		return bid;
	}
}

//先保存业务数据,再上传图片。业务数据保存后,需要回调此函数,触发文件上传
function businessCallback(response){
	$('#businessId').val(response.data.id);
	//上传文件
	uploadFile();
}
function uploadFile(){
	fileinput.upload();
}

/*	
function submit(){
	//保存业务数据成功后回调
	var data={
		'id':'1234567890'
	};
	businessCallback(data);
}
*/