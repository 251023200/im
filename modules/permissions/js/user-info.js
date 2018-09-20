$(function(){
	initData();
	var id=SysUserModel.queryString['id'];
	initUserInfo(id);
	initRoleList(id);
	initPermissionList(id);
	initOperationList(id);
	initMenuTree(id);
});
var SysUserModel={};
function initData(){//初始化数据
	SysUserModel.search={};
	SysUserModel.queryString=getQueryString();
}
function initUserInfo(id){//查看
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

function initRoleList(userId){
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
			/*
	        {
	        	'data': 'id',
	        	'render': function( data, type, full, meta ) {
	        		var str = '<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="viewRole(\''+data+'\')">查看</a>&nbsp;';
        		    //str+='<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="editUser(\''+data+'\')">编辑</a>&nbsp;';
        		    //str += '<a  class="remove btn btn-danger btn-xs" href="javascript:void(0)" title="Remove" onclick="deleteUser(\''+data+'\')">删除</a>';
        		   return str;
	        	}
	        },*/]
		});
}

function initPermissionList(userId){
	$('#permission-table').dataTable({
		destroy: true,
		"language": {
            "lengthMenu": "每页 _MENU_ 条记录",
            "zeroRecords": "尚未添加权限",
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
			var url = app.server.auth + "/users/{userId}/permissions/search?pageNum={pageNum}&pageSize={pageSize}";
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
			/*
	        {
	        	'data': 'id',
	        	'render': function( data, type, full, meta ) {
	        		var str = '<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="viewRole(\''+data+'\')">查看</a>&nbsp;';
        		    //str+='<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="editUser(\''+data+'\')">编辑</a>&nbsp;';
        		    //str += '<a  class="remove btn btn-danger btn-xs" href="javascript:void(0)" title="Remove" onclick="deleteUser(\''+data+'\')">删除</a>';
        		   return str;
	        	}
	        },*/]
		});
}

function initOperationList(userId){
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
	   "lengthMenu": [[5,10,25,50], [5,10,25,50]],
       "serverSide": true,
       "bFilter": false, //过滤功能  
       "bSort": false, //排序功能  
       "sProcessing": "<img src='../img/loading.gif'/>",
	   "ajax" :function(data,callback,settings){
			var pageSize = data.length;
			var pageNum = data.start/data.length+1;
			var url = app.server.auth + "/users/{userId}/operations/search?pageNum={pageNum}&pageSize={pageSize}";
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
			{ "data": "appName"}, 
			{ "data": "method"}, 
			{ "data": "url"}, 
	        { "data": "description"},
			/*
	        {
	        	'data': 'id',
	        	'render': function( data, type, full, meta ) {
	        		var str = '<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="viewRole(\''+data+'\')">查看</a>&nbsp;';
        		    //str+='<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="editUser(\''+data+'\')">编辑</a>&nbsp;';
        		    //str += '<a  class="remove btn btn-danger btn-xs" href="javascript:void(0)" title="Remove" onclick="deleteUser(\''+data+'\')">删除</a>';
        		   return str;
	        	}
	        },*/]
		});
}

function initMenuTree(userId){
	//var userId = SysRoleMenuModel.queryString['id'];
	var url = app.server.auth + "/users/{userId}/menus/tree";
	url = url.replace("{userId}",userId);
	$.ajax({
	    url: url,
	    method:'GET',
	    cache: false,
		headers:{
			"Authorization":"Bearer "+Token.getAccessToken(),
		},
	    //beforeSend:ajaxLoading,// 开启loading
		success: function(res) {
			/*
	        $.each(res.data, function(i, menu) {
				formatMenu(menu);
	        });
			*/
	        $('#menu-tree').treeview({
				showCheckbox: false,
				data:res.data,
	        	levels: 2,
				//onNodeChecked:nodeChecked,
				//onNodeUnchecked:nodeUnchecked,
	        	//color: '#ffffff',
	        	//selectedBackColor: '#f5f5f5',
	        	//selectedColor: '#666666',
	        	//onhoverColor: '#003366'
	        });
	       
	        //$('#tree').on('nodeSelected', selectMenu);
	        
	        //closeAjaxLoading();
	    },
	    complete:function(){
			//关闭覆盖层 loading
	        closeAjaxLoading();
		}
	});
}