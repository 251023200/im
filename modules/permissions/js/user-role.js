$(function(){
	initData();
	initUserInfo();
	initRoleList();
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
}

function initRoleList(){
	var userId=SysUserModel.queryString['id'];
	$('#role-table').dataTable({
		destroy: true,
		"language": {
            "lengthMenu": "每页 _MENU_ 条记录",
            "zeroRecords": "尚未添加角色",
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
			var url = app.server.auth + "/users/{userId}/roles/search?pageNum={pageNum}&pageSize={pageSize}";
			url = url.replace("{pageNum}",pageNum).replace("{pageSize}",pageSize).replace("{userId}",userId);
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
					console.log(result);
				   	var res={};
				   	res.draw=data.draw;
				   	res.recordsTotal=result.data.total;
				   	res.recordsFiltered = result.data.total;
				   	res.data=result.data.list;
					//saveOriginSelectedRoles(result.data.list);
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
	        		var str='';
					//str += '<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="viewRole(\''+data+'\')">查看</a>&nbsp;';
        		    //str+='<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="editUser(\''+data+'\')">编辑</a>&nbsp;';
        		    str += '<a  class="remove btn btn-danger btn-xs" href="javascript:void(0)" title="Remove" onclick="deleteUserRole(\''+data+'\')">删除</a>';
        		   return str;
	        	}
	        },
			
		]
	});
}

function saveOriginSelectedRoles(datalist){
	originSelectedRoles = [];
	for(var i=0;i<datalist.length;i++){
		var data = datalist[i];
		originSelectedRoles.push({
			"id" : data.id,
			"code" : data.code,
			"name" : data.name,
			"description" : data.description
		});
	}
	console.log('原roles');
	console.log(originSelectedRoles);
}
function addRole(){//添加角色
	//console.log("已选择的")
	//console.log(originSelectedRoles);
	var userId=SysUserModel.queryString['id'];
	var searchLeftRoleUrl = app.server.auth + '/users/{userId}/roles/search-left';
	searchLeftRoleUrl = searchLeftRoleUrl.replace('{userId}',userId);
	$.addRoleSelector.show(function(roles){
		console.log('回调后');
		console.log(roles);
		originSelectedRoles = roles;
		addRoleCallback(roles);
	},searchLeftRoleUrl);
}

function addRoleCallback(roles){
	var userId=SysUserModel.queryString['id'];
	var rolesToAdd = [];
	for(var i=0;i<roles.length;i++){
		rolesToAdd.push({
			'userId':userId,
			'roleId':roles[i].id
		});
	}
	var url=app.server.auth+"/user-roles/batch-add";
	var method = "POST";
	$.ajax({
		type:method,
		url:url,
		contentType:"application/json",
		data:JSON.stringify(rolesToAdd),
		dataType:"json",
		headers:{
			"Authorization":"Bearer "+Token.getAccessToken(),
		},
		success:function(result){
			swal({
				'title':'成功',
				'text': '角色已添加',
				'type':'success'
			},function(){//刷新
				initRoleList();
			});
		},
		error:function(message){
			handleError(message);
		}
	}); 
}

function deleteUserRole(roleId){
	var userId=SysUserModel.queryString['id'];
	var url=app.server.auth+"/users/{userId}/roles/{roleId}";
	url = url.replace("{userId}",userId).replace("{roleId}",roleId);
	var method = "DELETE";
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
				'text': '角色已删除',
				'type':'success'
			},function(){//刷新
				initRoleList();
			});
		},
		error:function(message){
			handleError(message);
		}
	}); 
}

function saveUser(){
	var userNo=$('#userInfoForm #userNo').val();
	var userName=$('#userInfoForm #userName').val();
	var name=$('#userInfoForm #name').val();
	//var password=$('#userInfoForm #password').val();
	var id=SysUserModel.queryString['id'];
	var param={
		'userNo':userNo,
		'userName':userName,
		'name':name,
		//'password':password,
	};
	var url=undefined;
	var method=undefined;
	var isAddOp=false;
	url=app.server.auth+"/users/{id}";	//PUT url
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
			handleError(message);
		}
	}); 
}
