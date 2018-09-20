$(function(){
	initData();
	initUserTableList();
});
var SysUserModel={};
function initData(){//初始化数据
	SysUserModel.search={};
}
function searchUser(){//查询
	SysUserModel.search.userNo=$("#userNo").val();
	SysUserModel.search.userName=$("#userName").val();
	SysUserModel.search.name=$("#name").val();
	initUserTableList();
}
function clearCondtion(){//重置
	$("#formsearch #uesrNo").val("");
	$("#formsearch #userName").val("");
	$("#formsearch #name").val("");
	delete SysUserModel.search.userNo;
	delete SysUserModel.search.userName;
	delete SysUserModel.search.name;
	initUserTableList();
}
function initUserTableList(){
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
			var url=app.server.auth+"/users/search?pageNum={pageNum}&pageSize={pageSize}";
		   	url = url.replace("{pageNum}",pageNum).replace("{pageSize}",pageSize);
		   	$.ajax({
			   	type:"POST",
			   	url:url,
			   	contentType:"application/json",
			   	data:JSON.stringify(SysUserModel.search),
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
	        { "data": "userNo"},
			{ "data": "userName"}, 
	        { "data": "name"},
			{ "data": "email"},
			{ "data": "telephone"},
			{ "data": "mobileTelephone"},
	        {
	        	'data': 'id',
	        	'render': function( data, type, full, meta ) {
	        		var str = '<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="viewUser(\''+data+'\')">查看</a>&nbsp;';
        		    str+='<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="editUser(\''+data+'\')">编辑</a>&nbsp;';
        		    str += '<a  class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="editUserRole(\''+data+'\')">配置角色</a>&nbsp;';
        		    str += '<a  class="remove btn btn-danger btn-xs" href="javascript:void(0)" title="Remove" onclick="deleteUser(\''+data+'\')">删除</a>';
					return str;
	        	}
	        },]
		});
}

function viewUser(id){
	var url="modules/permissions/html/user-info.html?id="+id;
	openTab(url,'用户信息');
}

function editUser(id){
	var url="modules/permissions/html/user-edit.html?id="+id;
	openTab(url,'修改用户');
}

function editUserRole(id){
	var url="modules/permissions/html/user-role.html?id="+id;
	openTab(url,'配置角色');
}

function addUser(){//添加
	$('#userModal input').val("");
	$('#userModal #dialogTitle').text('新增用户');
   	$('#userModal').modal('show');
}
function saveUser(){//保存
	var userNo=$('#userModal #userNo').val();
	var userName=$('#userModal #userName').val();
	var name=$('#userModal #name').val();
	var password=$('#userModal #password').val();
	var email =$('#userModal #email').val();
	var telephone =$('#userModal #telephone').val();
	var mobileTelephone =$('#userModal #mobileTelephone').val();
	var id=$('#userModal #id').val();
	var param={
		'userNo':userNo,
		'userName':userName,
		'name':name,
		'password':password,
		'email':email,
		'telephone':telephone,
		'mobileTelephone':mobileTelephone
	};
	var url=undefined;
	var method=undefined;
	var isAddOp=false;
	if(id==undefined||id.trim()=='')isAddOp=true;
	if(isAddOp){//添加
		alert('添加' + id);
		url=app.server.auth+"/users";	//POST url
		method="POST";
	}else{//修改
		alert('修改' + id);
		url=app.server.auth+"/users/{id}";	//PUT url
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
				$('#userModal').modal('hide');
				initUserTableList();
			});
		},
		error:function(message){
			handleError(message);
		}
	}); 
}

function deleteUser(id){//删除
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
		var url = app.server.auth + "/users/{id}";
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
					initUserTableList();
				});
			},
			error:function(message){
				handleError(message);
			}
		}); 
	});
}
function batchDeleteUser(ids){//删除
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
		var url=app.server.auth+"/user/batchDelete";
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
					initUserTableList();
				});
			},
			error:function(message){
				handleError(message);
			}
		}); 
	});
}
/*
function viewUser(id){//查看
	var url=app.server.auth+"/users/{id}";
	url = url.replace("{id}",id);
	$.ajax({
		type:"GET",
		url:url,
		contentType:"application/json",
		//data:JSON.stringify(param),
		dataType:"json",
		success:function(result){
			//console.log(result);
			if(result.code==0){
				showViewUserMoal(result.data);
			}
		},
		error:function(message){
			swal("获取数据失败","未能获取到数据,请重试","error");	
		}
	}); 
}
function showViewUserMoal(data){//展示修改数据
	$('#viewUserModal input').val("");
	$('#viewUserModal #dialogTitle').text('查看角色');
   	$('#viewUserModal').modal('show');
   	//$('#viewUserModal #userName').attr('readonly','true');
   	//$('#viewUserModal #userCode').attr('readonly','true');
   	//$('#viewUserModal #userDesc').attr('readonly','true');
   	$('#viewUserModal #userName').val(data.userName);
	$('#viewUserModal #userNo').val(data.userNo);
   	$('#viewUserModal #name').val(data.name);
}
function editUser(id){
	var url=app.server.auth+"/users/{id}";
	url = url.replace("{id}",id);
	$.ajax({
		type:"GET",
		url:url,
		contentType:"application/json",
		//data:JSON.stringify(param),
		dataType:"json",
		success:function(result){
			//console.log(result);
			if(result.code==0){
				showUserMoal(result.data);
			}
		},
		error:function(message){
			swal("获取数据失败","未能获取到数据,请重试","error");	
		}
	}); 
}
function showUserMoal(data){//展示修改数据
	$('#userModal input').val("");
	$('#userModal #dialogTitle').text('查看角色');
   	$('#userModal').modal('show');
   	$('#userModal #id').val(data.id);
   	$('#userModal #userNo').val(data.userNo);
   	$('#userModal #userName').val(data.userName);
   	$('#userModal #name').val(data.name);
}


function addTab(id){
	var url="modules/permissions/html/user-detail.html?id="+id;
	openTab(url);
}
*/


	