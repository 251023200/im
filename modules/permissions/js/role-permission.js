$(function(){
	initData();
	initRoleInfo();
	initPermissionList();
});
var SysRoleModel={};
var originSelectedPermissions=[];
var toSelectedPermissions=[];
function initData(){//初始化数据
	SysRoleModel.search={};
	SysRoleModel.queryString=getQueryString();
}
function initRoleInfo(id){//查看
	var id=SysRoleModel.queryString['id'];
	var url=app.server.auth+"/roles/{id}";
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
				showRoleInfo(result.data);
			}else{
				swal("获取数据失败","未能获取到数据,请重试","error");	
			}
		},
		error:function(message){
			handleError(message);
		}
	}); 
}
function showRoleInfo(role){
	$('#roleCode').val(role.code);
	$('#roleName').val(role.name);
	$('#roleDesc').val(role.description);
}

function initPermissionList(){
	var roleId=SysRoleModel.queryString['id'];
	$('#permission-table').dataTable({
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
			var url = app.server.auth + "/roles/{roleId}/permissions/search?pageNum={pageNum}&pageSize={pageSize}";
			url = url.replace("{pageNum}",pageNum).replace("{pageSize}",pageSize).replace("{roleId}",roleId);
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
					console.log('---get permissions---')
					console.log(result);
				   	var res={};
				   	res.draw=data.draw;
				   	res.recordsTotal=result.data.total;
				   	res.recordsFiltered = result.data.total;
				   	res.data=result.data.list;
					//saveOriginSelectedPermissions(result.data.list);
				   	callback(res);
			   },
			   error:function(message){
				   handleError(message);
			   }
		   });   
		},
	    "columns":[
			{ "data": "name"}, 
	        { "data": "code"},
	        { "data": "description"},
			{
	        	'data': 'id',
	        	'render': function( data, type, full, meta ) {
	        		var str = '<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="viewPermission(\''+data+'\')">查看</a>&nbsp;';
        		    //str+='<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="editRole(\''+data+'\')">编辑</a>&nbsp;';
        		    str += '<a  class="remove btn btn-danger btn-xs" href="javascript:void(0)" title="Remove" onclick="deleteRolePermission(\''+data+'\')">删除</a>';
        		   return str;
	        	}
	        },
			
		]
	});
}

function saveOriginSelectedPermissions(datalist){
	originSelectedPermissions = [];
	for(var i=0;i<datalist.length;i++){
		var data = datalist[i];
		originSelectedPermissions.push({
			"id" : data.id,
			"code" : data.code,
			"name" : data.name,
			"description" : data.description
		});
	}
	console.log('原permissions');
	console.log(originSelectedPermissions);
}
function addPermissions(){//添加操作
	//var originSelected = [];
	console.log("已选择的")
	console.log(originSelectedPermissions);
	var roleId=SysRoleModel.queryString['id'];
	var searchLeftPermissionUrl = app.server.auth + '/roles/{roleId}/permissions/search-left';
	searchLeftPermissionUrl = searchLeftPermissionUrl.replace('{roleId}',roleId);
	$.addPermissionSelector.show(function(permissions){
		console.log('回调后');
		console.log(permissions);
		originSelectedPermissions = permissions;
		addPermissionCallback(permissions);
	},searchLeftPermissionUrl);
}

function addPermissionCallback(permissions){
	var roleId=SysRoleModel.queryString['id'];
	var permissionsToAdd = [];
	for(var i=0;i<permissions.length;i++){
		permissionsToAdd.push({
			'roleId':roleId,
			'permissionId':permissions[i].id
		});
	}
	var url=app.server.auth+"/role-permissions/batch-add";
	var method = "POST";
	$.ajax({
		type:method,
		url:url,
		contentType:"application/json",
		data:JSON.stringify(permissionsToAdd),
		dataType:"json",
		headers:{
			"Authorization":"Bearer "+Token.getAccessToken(),
		},
		success:function(result){
			if(result.code==0){
				swal({
					'title':'成功',
					'text': '权限已添加',
					'type':'success'
				},function(){//刷新
					initPermissionList();
				});
			}else{
				swal("失败","权限未添加","error");
			}
		},
		error:function(message){
			handleError(message);
		}
	}); 
}

function deleteRolePermission(permissionId){
	var roleId=SysRoleModel.queryString['id'];
	var url=app.server.auth+"/roles/{roleId}/permissions/{permissionId}";
	url = url.replace("{roleId}",roleId).replace("{permissionId}",permissionId);
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
			if(result.code==0){
				swal({
					'title':'删除成功',
					'text': '权限已删除',
					'type':'success'
				},function(){//刷新
					initPermissionList();
				});
			}else{
				swal("失败","权限未删除","error");
			}
		},
		error:function(message){
			handleError(message);
		}
	}); 
}

/*
function saveRole(){
	var permissionNo=$('#permissionInfoForm #permissionNo').val();
	var permissionName=$('#permissionInfoForm #permissionName').val();
	var name=$('#permissionInfoForm #name').val();
	//var password=$('#permissionInfoForm #password').val();
	var id=SysRoleModel.queryString['id'];
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