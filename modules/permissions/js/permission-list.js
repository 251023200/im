$(function(){
	initData();
	initPermissionTableList();
});
var SysPermissionModel={};
function initData(){//初始化数据
	SysPermissionModel.search={};
}
function searchPermission(){//查询
	SysPermissionModel.search.permissionName=$("#permissionName").val();
	initPermissionTableList();
}
function clearCondtion(){//重置
	$("#permissionName").val("");
	delete SysPermissionModel.search.permissionName;
	initPermissionTableList();
}
function initPermissionTableList(){
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
			//console.log(data);

			var pageSize = data.length;
			var pageNum = data.start/data.length+1;;
			var url=app.server.auth+"/permissions/search?pageNum={pageNum}&pageSize={pageSize}";
		   	url = url.replace("{pageNum}",pageNum).replace("{pageSize}",pageSize);
		 	
		 	var param = {
		 		"name" : SysPermissionModel.search.permissionName,
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
				   	//res.recordsTotal=result.data.totalCount;
				   	//res.recordsFiltered = result.data.totalCount;
				   	//res.data=result.data.dataList;
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
	        { "data": "name"},
	        { "data": "code"},
	        { "data": "description"}, 
	        {
	        	'data': 'id',
	        	'render': function( data, type, full, meta ) {
	        		var str = '<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="viewPermission(\''+data+'\')">查看</a>&nbsp;';
        		    str+='<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="editPermission(\''+data+'\')">编辑</a>&nbsp;';
					str += '<a  class="remove btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="editMenuPermissions(\''+data+'\')">配置菜单权限</a>&nbsp;';
					str += '<a  class="remove btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="editOperationPermissions(\''+data+'\')">配置操作权限</a>&nbsp;';
        		    //str += '<a  class="remove btn btn-danger btn-xs" href="javascript:void(0)" title="Like" onclick="editPermissionPermission(\''+data+'\')">配置权限</a>&nbsp;';
        		    str += '<a  class="remove btn btn-danger btn-xs" href="javascript:void(0)" title="Remove" onclick="deletePermission(\''+data+'\')">删除</a>';
        		   return str;
	        	}
	        },]
		});
}

function viewPermission(id){
	var url="modules/permissions/html/permission-info.html?id="+id;
	//alert(url);
	openTab(url,'权限信息');
}

//function editPermission(id){
	//var url="modules/permissions/html/permission-edit.html?id="+id;
	//openTab(url,'修改权限');
//}

function editMenuPermissions(id){
	var url="modules/permissions/html/permission-menu.html?id="+id;
	openTab(url,'配置菜单');
}

function editOperationPermissions(id){
	var url="modules/permissions/html/permission-operation.html?id="+id;
	openTab(url,'配置权限');
}

function  addPermission(){//添加
	//$('#permissionModal input').val("");
	//$('#permissionModal #dialogTitle').text('新增权限');
    //$('#permissionModal').modal('show');
	
	$('#upsert-permission-modal input').val("");
	$('#upsert-permission-modal #dialogTitle').text('新增权限');
   	$('#upsert-permission-modal').modal('show');
}

function savePermission(){//保存
	var id =$('#upsert-permission-id').val();
	var permissionCode=$('#upsert-permission-code').val();
	var permissionName=$('#upsert-permission-name').val();
	var permissionDesc=$('#upsert-permission-desc').val();
	var param={
		'code':permissionCode,
		'name':permissionName,
		'description':permissionDesc
	};
	var url=undefined;
	var method=undefined;
	var isAddOp=false;
	if(id==undefined||id.trim()=='')isAddOp=true;
	if(isAddOp){//添加
		alert('添加' + id);
		url=app.server.auth+"/permissions";	//POST url
		method="POST";
		//alert('post');
	}else{//修改
		alert('修改' + id);
		url=app.server.auth+"/permissions/{id}";	//PUT url
		url=url.replace("{id}",id);
		method="PUT";
		//alert(method+' '+url);
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
				if(isAddOp){
					var title='成功';
					var content='数据已添加';
				}else{
					var title='成功';
					var content='数据已修改';
				}
				swal({
					'title': title,
					'text': content,
					'type':'success'
				},function(){//刷新
					$('#upsert-permission-modal').modal('hide');
					initPermissionTableList();
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
function deletePermission(id){//删除
	swal({
		title: "您确定要删除吗?",   
		text: "删除后将不可恢复!",
		type: "warning",
		showCancelButton: true,
		cancelButtonText:"取消",
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "是的，我要删除",
		closeOnConfirm: false 
	},function(){
		var url = app.server.auth + "/permissions/{id}";
		url = url.replace("{id}",id);
		$.ajax({
			type:"DELETE",
			url:url,
			contentType:"application/json",
			dataType:"json",
			headers:{
				"Authorization":"Bearer "+Token.getAccessToken(),
			},
			success:function(result){
				swal({
					'title':'删除成功',
					'text': '权限已删除',
					'type':'success'
				},function(){//刷新
					initPermissionTableList();
				});
			},
			error:function(message){
				handleError(message);
			}
		}); 
	});
}
function batchDeletePermission(ids){//删除
	swal({
		title: "您确定要删除吗?",   
		text: "删除后将不可恢复!",
		type: "warning",
		showCancelButton: true,
		cancelButtonText:"取消",
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "是的，我要删除",
		closeOnConfirm: false 
	},function(){
		var url=app.server.auth+"/permission/batchDelete";
		var ids = ids;	//TODO 获取ids
		$.ajax({
			type:"POST",
			url:url,
			contentType:"application/json",
			data:JSON.stringify(ids),
			dataType:"json",
			headers:{
				"Authorization":"Bearer "+Token.getAccessToken(),
			},
			success:function(result){
				swal({
					'title':'删除成功',
					'text': '权限已删除',
					'type':'success'
				},function(){//刷新
					initPermissionTableList();
				});
			},
			error:function(message){
				handleError(message);
			}
		}); 
	});
}

function editPermission(id){//编辑
	var url=app.server.auth+"/permissions/{id}";
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

function showOperationEditView(data){//展示修改数据
	$('#upsert-permission-modal input').val("");
	$('#upsert-permission-modal #dialogTitle').text('编辑权限');
   	$('#upsert-permission-modal').modal('show');
   	$('#upsert-permission-id').val(data.id);
   	$('#upsert-permission-name').val(data.name);
   	$('#upsert-permission-code').val(data.code);
   	$('#upsert-permission-desc').val(data.description);
}
