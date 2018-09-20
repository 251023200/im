$(function(){
	initData();
	var id=SysPermissionModel.queryString['id'];
	initPermissionView(id);
	initOperationList(id);
	initMenuTree(id);
});
var SysPermissionModel={};
function initData(){//初始化数据
	SysPermissionModel.queryString=getQueryString();
}
function initPermissionView(id){//查看
	//var id=SysPermissionModel.queryString["id"];
	var url=app.server.auth+"/permissions/{id}";
	url = url.replace("{id}",id);
	$.ajax({
		type:"GET",
		url:url,
		contentType:"application/json",
		dataType:"json",
		headers:{
			"Authorization":"Bearer "+Token.getAccessToken(),
		},
		success:function(result){
			//console.log(result);
			if(result.code==0){
				showPermissionView(result.data);
			}
		},
		error:function(message){
			handleError(message);
		}
	}); 
}
function showPermissionView(data){//展示角色数据
	$('#input').val("");
   	$('#permissionName').val(data.name);
   	$('#permissionCode').val(data.code);
   	$('#permissionDesc').val(data.description);
}

function initOperationList(permissionId){
	$('#operation-table').dataTable({
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
			/*
	        {
	        	'data': 'id',
	        	'render': function( data, type, full, meta ) {
	        		var str = '<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="viewPermission(\''+data+'\')">查看</a>&nbsp;';
        		    //str+='<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="editUser(\''+data+'\')">编辑</a>&nbsp;';
        		    //str += '<a  class="remove btn btn-danger btn-xs" href="javascript:void(0)" title="Remove" onclick="deleteUser(\''+data+'\')">删除</a>';
        		   return str;
	        	}
	        },*/]
		});
}

function initMenuTree(permissionId){
	var url = app.server.auth + "/permissions/{permissionId}/menus/tree";
	url = url.replace("{permissionId}",permissionId);
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