$(function(){
	initData();
	initOperationTableList();
});
var SysOperationModel={};
function initData(){//初始化数据
	SysOperationModel.queryString=getQueryString();
	SysOperationModel.search={};
	var appId = SysOperationModel.queryString['appId'];
	if(appId!=undefined&&appId!=null&&appId.trim()!=''){
		SysOperationModel.search.appId=appId;	//应用编号
	}
}
function searchOperation(){//查询
	SysOperationModel.search.operationName=$("#operationName").val();
	initOperationTableList();
}
function clearCondtion(){//重置
	$("#operationName").val("");
	delete SysOperationModel.search.operationName;
	initOperationTableList();
}
function  addOperation(){//添加
	var appId = SysOperationModel.queryString['appId'];
	
	$('#upsert-operation input').val("");
	if(appId==undefined||appId==null||appId.trim()==''){
		$('#upsert-operation #application').css('display','block'); 
	}else{//存在应用appId,不需要选择
		$('#upsert-operation #application').css('display','none'); 
		$('#upsert-app-id').val(appId);
		$('#upsert-app-id').val(appId);
	}
	$('#upsert-operation #dialogTitle').text('新增操作');
   	$('#upsert-operation').modal('show');
}
function saveOperation(){//保存
	var appId=$('#upsert-app-id').val();
	var operationCode=$('#upsert-operation-code').val();
	var operationName=$('#upsert-operation-name').val();
	var operationMethod=$('#upsert-operation-method').val();
	var operationUrl=$('#upsert-operation-url').val();
	var operationDesc=$('#upsert-operation-desc').val();
	var id=$('#upsert-operation-id').val().trim();
	var param={
		'appId':appId,
		'code':operationCode,
		'name':operationName,
		'method':operationMethod,
		'url':operationUrl,
		'description':operationDesc
	};
	var url=undefined;
	var method=undefined;
	if(id==''){//保存
		url=app.server.auth+"/operations";	//POST url
		method="POST";
	}else{//修改
		url=app.server.auth+"/operations/{id}";	//PUT url
		url=url.replace("{id}",id);
		method="PUT";
	}
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
			if(result.code==0){
				swal({
				'title':'保存成功',
				'text': '数据已新增',
				'type':'success'
				},function(){//刷新
					$('#upsert-operation').modal('hide');
					initOperationTableList();
				});
			}else{
				swal("保存失败","数据未保存,请重试","error");
			}
		},
		error:function(message){
			handleError(message);
		}
	}); 
}

function chooseApp(){
	var appId = 'dad133b9b01741fa80d351750b2dd463';
	var appName = "控制台";
	var appCode = "console";
	$('#upsert-app-id').val(appId);
	$('#upsert-app-name').val(appName);
	$('#upsert-app-code').val(appCode);
}

function initOperationTableList(){
	$('#table').dataTable({
		destroy: true,
		"language": {
            "lengthMenu": "每页 _MENU_ 条记录",
            "zeroRecords": "没有找到记录",
            "info": "第 _PAGE_ 页 (共 _PAGES_ 页 )",
            "infoEmpty": "无记录",
            "infoFiltered": "(从 _MAX_ 条记录过滤)",
            "paginate": {
                "first": "首页",
                "last":"末页",
                "previous":"上一页",
                "next":"下一页"
             }
        },
		"responsive" : {
			"details":{
				
			}
		},
		//"sDom":'rtl<"bottom"ip<"clear">>',
		"sDom":'rt<"clear"><"bottom"ip<"clear">>',
		"info":true,
       // "processing": true,
	   "pagingType": "full_numbers",
	   //"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
	   "lengthMenu": [[10,25,50], [10,25,50]],
       "serverSide": true,
       "bFilter": false, //过滤功能  
       "bSort": false, //排序功能  
       "sProcessing": "<img src='../img/loading.gif'/>",
	   "ajax" :function(data,callback,settings){
		    var pageSize = data.length;
			var pageNum = data.start/data.length+1;
			var url=app.server.auth+"/operations/search?pageNum={pageNum}&pageSize={pageSize}";
			url = url.replace("{pageNum}",pageNum).replace("{pageSize}",pageSize);
			var param = {
				"name" : SysOperationModel.search.operationName,
				"appId" : SysOperationModel.search.appId
			};
			$.ajax({
				type:"POST",
				url:url,
				contentType:"application/json",
				data:JSON.stringify(param),
				dataType:"json",
				headers:{
					"Authorization":"Bearer "+Token.getAccessToken(),
				},
				success:function(result){
					console.log(result);
					var res={};
					res.draw=data.draw;
					res.recordsTotal=result.data.total;
					res.recordsFiltered = result.data.total;
					res.data=result.data.list;
					callback(res);
			   },
			   error:function(message){
				   handleError(message);
			   }
		   });   
		},
	    "columns":[
			{ "data": "appName"},
	        { "data": "appCode"},
	        { "data": "name"},
			{ "data": "code"},
			{ "data": "method"}, 
			{ "data": "url"}, 
	        { "data": "description"},
	        {
	        	'data': 'id',
	        	'render': function( data, type, full, meta ) {
	        		var str ='<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="viewOperation(\''+data+'\')">查看</a>&nbsp;';
	        		str+='<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="editOperation(\''+data+'\')">编辑</a>&nbsp;';
	        		str += '<a  class="remove btn btn-danger btn-xs" href="javascript:void(0)" title="Remove" onclick="deleteOperation(\''+data+'\')">删除</a>';
        		   return str;
	        	}
	        },]
		});
}

function viewOperation(id){//编辑
	//var id = SysOperationModel.queryString['id'];
	var url=app.server.auth+"/operations/{id}";
	url = url.replace("{id}",id);
	$.ajax({
		type:"GET",
		url:url,
		dataType:"json",
		headers:{
			"Authorization":"Bearer "+Token.getAccessToken(),
		},
		success:function(result){
			console.log(result);
			if(result.code==0){
				showOperationView(result.data);
			}
		},
		error:function(message){
			handleError(message);		
		}
	}); 
}
function showOperationView(data){//展示修改数据
	$('#view-operation input').val("");
	$('#view-operation #dialogTitle').text('查看操作');
   	$('#view-operation').modal('show');
   	$('#view-operation #id').val(data.id);
	$('#view-operation #appName').val(data.appName);
	$('#view-operation #appCode').val(data.appCode);
   	$('#view-operation #operationName').val(data.name);
   	$('#view-operation #operationCode').val(data.code);
	$('#view-operation #operationUrl').val(data.url);
   	$('#view-operation #operationMethod').val(data.method);
   	$('#view-operation #operationDesc').val(data.description);
}
function editOperation(id){//编辑
	//var id = SysOperationModel.queryString['id'];
	var url=app.server.auth+"/operations/{id}";
	url = url.replace("{id}",id);
	$.ajax({
		type:"GET",
		url:url,
		dataType:"json",
		headers:{
			"Authorization":"Bearer "+Token.getAccessToken(),
		},
		success:function(result){
			//console.log(result);
			if(result.code==0){
				showOperationEditView(result.data);
			}else{
				swal("获取数据失败","未能获取到数据,请重试","error");		
			}
		},
		error:function(message){
			handleError(message);	
		}
	}); 
}
function showOperationEditView(data){
	var appId = SysOperationModel.queryString['appId'];
	if(appId==undefined||appId==null||appId.trim()==''){
		$('#application').css('display','block'); 
	}else{
		$('#application').css('display','none'); 
	}
	$('#upsert-operation input').val("");
	$('#upsert-operation #dialogTitle').text('编辑操作');
   	$('#upsert-operation').modal('show');
   	$('#upsert-operation-id').val(data.id);
	$('#upsert-app-id').val(data.appId);
	$('#upsert-app-name').val(data.appName);
	$('#upsert-app-code').val(data.appCode);
   	$('#upsert-operation-name').val(data.name);
   	$('#upsert-operation-code').val(data.code);
   	$('#upsert-operation-method').val(data.method);
	$('#upsert-operation-url').val(data.url);
   	$('#upsert-operation-desc').val(data.description);
}
function deleteOperation(id){
	var url = app.server.auth+"/operations/{id}";	//DELETE url
	url = url.replace("{id}",id);
	var method = "DELETE";
	var param = {};
	$.ajax({
		url : url,
		type : method,
		contentType : "application/json",
		data : JSON.stringify(param),
		dataType : "json",
		headers:{
			"Authorization":"Bearer "+Token.getAccessToken(),
		},
		success : function(result){
			swal({
				'title':'成功',
				'text': '数据已删除',
				'type':'success'
			},function(){//刷新
				initOperationTableList();
			});
		},
		error : function(message){
			handleError(message);
		}
	});
}

function deleteOperations(ids){//删除
	var roles = new Array();
	var role={
		'id':id
	};
	roles.push(role);
	
	swal({
		title: "您确定要删除吗?",   
		text: "删除后将不可恢复!",
		type: "warning",
		showCancelButton: true,
		cancelButtonText:"取消",
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "是的，我要删除",
		closeOnConfirm: false },
		function(){
			var url=app.server.auth+"/operations/batch-delete";
			$.ajax({
				type:"POST",
				url:url,
				contentType:"application/json",
				data:JSON.stringify(roles),
				dataType:"json",
				headers:{
					"Authorization":"Bearer "+Token.getAccessToken(),
				},
				success:function(result){
					swal({
						'title':'删除成功',
						'text': '数据已删除',
						'type':'success'
					},function(){//刷新
						initRoleTableList();
					});
				},
				error:function(message){
					handleError(message);
				}
			}); 
		});
}
function showEdit(data){//展示修改数据
	$('#operationModal input').val("");
	$('#operationModal #dialogTitle').text('修改角色');
   	$('#operationModal').modal('show');
   	for(var e in data){
   		$('#operationModal #'+e).val(data[e]);
   	}
}