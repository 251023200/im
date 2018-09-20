$(function(){
	initData();
	initRoleTableList();
});
var SysRoleModel={};
function initData(){//初始化数据
	SysRoleModel.search={};
}
function searchRole(){//查询
	SysRoleModel.search.roleName=$("#roleName").val();
	initRoleTableList();
}
function clearCondtion(){//重置
	$("#roleName").val("");
	delete SysRoleModel.search.roleName;
	initRoleTableList();
}
function initRoleTableList(){
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
			var url=app.server.auth+"/roles/search?pageNum={pageNum}&pageSize={pageSize}";
		   	url = url.replace("{pageNum}",pageNum).replace("{pageSize}",pageSize);
		 	
		 	var param = {
		 		"name" : SysRoleModel.search.roleName,
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
	       
	        { "data": "code"},
	        { "data": "name"},
	        { "data": "description"}, 
	        {
	        	'data': 'id',
	        	'render': function( data, type, full, meta ) {
	        		var str = '<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="viewRole(\''+data+'\')">查看</a>&nbsp;';
        		    str+='<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="editRole(\''+data+'\')">编辑</a>&nbsp;';
					str += '<a  class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="editRoleMenus(\''+data+'\')">配置菜单</a>&nbsp;';
					str += '<a  class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="editRolePermissions(\''+data+'\')">配置权限</a>&nbsp;';
        		    //str += '<a  class="remove btn btn-danger btn-xs" href="javascript:void(0)" title="Like" onclick="editRolePermission(\''+data+'\')">配置权限</a>&nbsp;';
        		    str += '<a  class="remove btn btn-danger btn-xs" href="javascript:void(0)" title="Remove" onclick="deleteRole(\''+data+'\')">删除</a>';
        		   return str;
	        	}
	        },]
		});
}

function viewRole(id){
	var url="modules/permissions/html/role-info.html?id="+id;
	//alert(url);
	openTab(url,'角色信息');
}

function editRole(id){
	var url="modules/permissions/html/role-edit.html?id="+id;
	openTab(url,'修改角色');
}

function editRoleMenus(id){
	var url="modules/permissions/html/role-menu.html?id="+id;
	openTab(url,'配置菜单');
}

function editRolePermissions(id){
	var url="modules/permissions/html/role-permission.html?id="+id;
	openTab(url,'配置角色权限');
}

function  addRole(){//添加
	$('#roleModal input').val("");
	$('#roleModal #dialogTitle').text('新增角色');
   	$('#roleModal').modal('show');
}
function saveRole(){//保存
	var roleCode=$('#roleModal #roleCode').val();
	var roleName=$('#roleModal #roleName').val();
	var roleDesc=$('#roleModal #roleDesc').val();
	var id=$('#roleModal #id').val();
	var param={
		'code':roleCode,
		'name':roleName,
		'description':roleDesc
	};
	var url=undefined;
	var method=undefined;
	var isAddOp=false;
	if(id==undefined||id.trim()=='')isAddOp=true;
	if(isAddOp){//添加
		//alert('添加' + id);
		url=app.server.auth+"/roles";	//POST url
		method="POST";
		//alert('post');
	}else{//修改
		//alert('修改' + id);
		url=app.server.auth+"/roles/{id}";	//PUT url
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
				$('#roleModal').modal('hide');
				initRoleTableList();
			});
		},
		error:function(message){
			handleError(message);
		}
	}); 
}
function deleteRole(id){//删除
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
		var url = app.server.auth + "/roles/{id}";
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
					'text': '角色已删除',
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
function batchDeleteRole(ids){//删除
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
		var url=app.server.auth+"/role/batchDelete";
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
					'text': '角色已删除',
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

function showViewRoleMoal(data){//展示修改数据
	$('#viewRoleModal input').val("");
	$('#viewRoleModal #dialogTitle').text('查看角色');
   	$('#viewRoleModal').modal('show');
   	//$('#viewRoleModal #roleName').attr('readonly','true');
   	//$('#viewRoleModal #roleCode').attr('readonly','true');
   	//$('#viewRoleModal #roleDesc').attr('readonly','true');
   	$('#viewRoleModal #roleName').val(data.name);
   	$('#viewRoleModal #roleCode').val(data.code);
   	$('#viewRoleModal #roleDesc').val(data.description);
}
function showRoleMoal(data){//展示修改数据
	$('#roleModal input').val("");
	$('#roleModal #dialogTitle').text('查看角色');
   	$('#roleModal').modal('show');
   	$('#roleModal #id').val(data.id);
   	$('#roleModal #roleName').val(data.name);
   	$('#roleModal #roleCode').val(data.code);
   	$('#roleModal #roleDesc').val(data.description);
}
