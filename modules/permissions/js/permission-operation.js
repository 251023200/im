$(function(){
	initData();
	initPermissionInfo();
	initOperationList();
});
var SysPermissionModel={};
var originSelectedOperations=[];
var toSelectedOperations=[];
function initData(){//初始化数据
	SysPermissionModel.search={};
	SysPermissionModel.queryString=getQueryString();
}
function initPermissionInfo(id){//查看
	var id=SysPermissionModel.queryString['id'];
	var url=app.server.auth+"/permissions/{id}";
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
			if(result.code==0){
				showPermissionInfo(result.data);
			}else{
				swal("获取数据失败","未能获取到数据,请重试","error");	
			}
		},
		error:function(message){
			handleError(message);	
		}
	}); 
}
function showPermissionInfo(permission){
	$('#permissionInfo #permissionCode').val(permission.code);
	$('#permissionInfo #permissionName').val(permission.name);
	$('#permissionInfo #permissionDesc').val(permission.description);
}

function initOperationList(){
	var permissionId=SysPermissionModel.queryString['id'];
	$('#operation-table').dataTable({
		destroy: true,
		"language": {
            "lengthMenu": "每页 _MENU_ 条记录",
            "zeroRecords": "尚未添加操作",
            "info": "第 _PAGE_ 页 (共 _PAGES_ 页 )",
            "infoEmpty": "",
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
			var url = app.server.auth + "/permissions/{permissionId}/operations/search?pageNum={pageNum}&pageSize={pageSize}";
			url = url.replace("{pageNum}",pageNum).replace("{pageSize}",pageSize).replace("{permissionId}",permissionId);
			var param={};
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
				   	var res={};
				   	res.draw=data.draw;
				   	res.recordsTotal=result.data.total;
				   	res.recordsFiltered = result.data.total;
				   	res.data=result.data.list;
					//saveOriginSelectedOperations(result.data.list);
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
	        		var str = '<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="viewOperation(\''+data+'\')">查看</a>&nbsp;';
        		    //str+='<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="editPermission(\''+data+'\')">编辑</a>&nbsp;';
        		    str += '<a  class="remove btn btn-danger btn-xs" href="javascript:void(0)" title="Remove" onclick="deletePermissionOperation(\''+data+'\')">删除</a>';
        		   return str;
	        	}
	        },
			
		]
	});
}

function saveOriginSelectedOperations(datalist){
	originSelectedOperations = [];
	for(var i=0;i<datalist.length;i++){
		var data = datalist[i];
		originSelectedOperations.push({
			"id" : data.id,
			"code" : data.code,
			"name" : data.name,
			"description" : data.description
		});
	}
	console.log('原operations');
	console.log(originSelectedOperations);
}
function addOperations(){//添加操作
	//var originSelected = [];
	console.log("已选择的")
	console.log(originSelectedOperations);
	var permissionId=SysPermissionModel.queryString['id'];
	var searchLeftOperationUrl = app.server.auth + '/permissions/{permissionId}/operations/search-left';
	searchLeftOperationUrl = searchLeftOperationUrl.replace('{permissionId}',permissionId);
	$.addOperationSelector.show(function(operations){
		console.log('回调后');
		console.log(operations);
		originSelectedOperations = operations;
		addOperationCallback(operations);
	},searchLeftOperationUrl);
}

function addOperationCallback(operations){
	var permissionId=SysPermissionModel.queryString['id'];
	var operationsToAdd = [];
	for(var i=0;i<operations.length;i++){
		operationsToAdd.push({
			'permissionId':permissionId,
			'operationId':operations[i].id
		});
	}
	var url=app.server.auth+"/permission-operations/batch-add";
	var method = "POST";
	$.ajax({
		type:method,
		url:url,
		contentType:"application/json",
		data:JSON.stringify(operationsToAdd),
		dataType:"json",
		headers:{
			"Authorization":"Bearer "+Token.getAccessToken(),
		},
		success:function(result){
			swal({
				'title':'成功',
				'text': '操作已添加',
				'type':'success'
			},function(){//刷新
				initOperationList();
			});
		},
		error:function(message){
			handleError(message);
		}
	}); 
}

function deletePermissionOperation(operationId){
	var permissionId=SysPermissionModel.queryString['id'];
	var url=app.server.auth+"/permissions/{permissionId}/operations/{operationId}";
	url = url.replace("{permissionId}",permissionId).replace("{operationId}",operationId);
	var method = "DELETE";
	//alert(url)
	var param={};
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
			swal({
				'title':'删除成功',
				'text': '操作已删除',
				'type':'success'
			},function(){//刷新
				initOperationList();
			});
		},
		error:function(message){
			handleError(message);
		}
	}); 
}

/*
function savePermission(){
	var permissionNo=$('#permissionInfoForm #permissionNo').val();
	var permissionName=$('#permissionInfoForm #permissionName').val();
	var name=$('#permissionInfoForm #name').val();
	//var password=$('#permissionInfoForm #password').val();
	var id=SysPermissionModel.queryString['id'];
	var param={
		'permissionNo':permissionNo,
		'permissionName':permissionName,
		'name':name,
		//'password':password,
	};
	var url=undefined;
	var method=undefined;
	var isAddOp=false;
	url=app.server.auth+"/permissions/{id}";	//PUT url
	url=url.replace("{id}",id);
	method="PUT";
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
		},
		error:function(message){
			swal("保存失败","数据未保存,请重试","error");
		}
	}); 
}
*/
