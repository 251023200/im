$(function(){
	initData();
	intResourceTableList();
	getMenuTree();
});
var SysResourceModel={};
function initData(){//初始化数据
	SysResourceModel.search={};
}
function searchResource(){//查询
	SysResourceModel.search.name=$("#resourceName").val();
	SysResourceModel.search.code=$("#resourceCode").val();
	SysResourceModel.search.type=$("#resourceType").val();
	intResourceTableList();
}
function clearCondtion(){//重置
	$("#formsearch #resourceName").val("");
	$("#formsearch #resourceCode").val("");
	$("#formsearch #resourceType").val("");
	delete SysResourceModel.search.name;
	delete SysResourceModel.search.code;
	delete SysResourceModel.search.type;
	intResourceTableList();
}
function intResourceTableList(){
	$('#table').dataTable({
		destroy: true,
		"language": {
            "lengthMenu": "每页 _MENU_ 条记录",
            "zeroRecords": "尚未添加资源",
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
			var url=app.server.auth+"/resources/search?pageNum={pageNum}&pageSize={pageSize}";
		   	url = url.replace("{pageNum}",pageNum).replace("{pageSize}",pageSize);
		   	$.ajax({
			   	type:"POST",
			   	url:url,
			   	contentType:"application/json",
			   	data:JSON.stringify(SysResourceModel.search),
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
	        { "data": "type"},
			{ "data": "uri"},
			{ "data": "description"},
	        {
	        	'data': 'id',
	        	'render': function( data, type, full, meta ) {
	        		var str = '<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="viewResource(\''+data+'\')">查看</a>&nbsp;';
        		    str+='<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="editResource(\''+data+'\')">编辑</a>&nbsp;';
        		    str += '<a  class="remove btn btn-danger btn-xs" href="javascript:void(0)" title="Remove" onclick="deleteResource(\''+data+'\')">删除</a>';
					return str;
	        	}
	        },]
		});
}

/*
function addResource(id){
	var url="modules/permissions/html/resource-add.html;
	openTab(url,'添加资源');
}
*/

function viewResource(id){
	var url="modules/permissions/html/resource-info.html?id="+id;
	openTab(url,'资源信息');
}

function editResource(id){
	var url="modules/permissions/html/resource-edit.html?id="+id;
	openTab(url,'修改资源');
}

function addResource(){//添加
	$('#resourceModal input').val("");
	$('#resourceModal #dialogTitle').text('新增资源');
   	$('#resourceModal').modal('show');
}

function saveResource(){//保存
	var resourceName=$('#resourceModal #resourceName').val();
	var resourceCode=$('#resourceModal #resourceCode').val();
	var resourceType=$('#resourceModal #resourceType').val();
	var resourceDesc=$('#resourceModal #resourceDesc').val();
	var resourceUrl=$('#resourceModal #resourceUrl').val();
	var id=$('#resourceModal #id').val();
	var param={
		'name':resourceName,
		'code':resourceCode,
		'type':resourceType,
		'uri':resourceUrl,
		'description':resourceDesc,
	};
	var url=undefined;
	var method=undefined;
	var isAddOp=false;
	if(id==undefined||id.trim()=='')isAddOp=true;
	if(isAddOp){//添加
		alert('添加' + id);
		url=app.server.auth+"/resources";	//POST url
		method="POST";
	}else{//修改
		alert('修改' + id);
		url=app.server.auth+"/resources/{id}";	//PUT url
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
				var content='资源已添加';
			}else{
				var title='成功';
				var content='资源已修改';
			}
			swal({
				'title': title,
				'text': content,
				'type':'success'
			},function(){//刷新
				$('#resourceModal').modal('hide');
				intResourceTableList();
			});
		},
		error:function(message){
			handleError(message);
		}
	}); 
}

function deleteResource(id){//删除
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
		var url = app.server.auth + "/resources/{id}";
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
					intResourceTableList();
				});
			},
			error:function(message){
				handleError(message);
			}
		}); 
	});
}
function batchDeleteResource(ids){//删除
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
		var url=app.server.auth+"/resources/batchDelete";
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
					intResourceTableList();
				});
			},
			error:function(message){
				swal("删除失败","数据未删除","error");
			}
		}); 
	});
}


function getMenuTree(){
	alert('....xx')
	$.ajax({
	        url: app.server.auth + "/menus/getTree",
	        method:'GET',
	        cache: false,
			headers:{
				"Authorization":"Bearer "+Token.getAccessToken(),
			},
	        //beforeSend:ajaxLoading,// 开启loading
	        success: function(data) {
	        	alert('getMenuTree')
	        	console.log(data);
	        	var leftRoot = {
	        		text: "左侧菜单",
	        		nodes: [],
	        		menuType: 0
	        	};
	        /*	var topRoot = {
	        		text: "顶部菜单",
	        		nodes: [],
	        		menuType: 1
	        	};
	        	*/

	        	var data = [{
	        			text : "权限管理",
	        			nodes : [{
	        				text : "用户管理",
	        				nodes : [],
	        				menuType : 1
	        			},{
	        				text : "角色管理",
	        				nodes : [],
	        				menuType : 1
	        			}],
	        			menuType : 1
	        		},{
	        			text : "订单管理",
	        			nodes : [],
	        			menuType : 1
	        		}
	        	];	

	        	$.each(data, function(i, n) {
	        		if (n /*&& n.menuType == 0*/) {
	        			leftRoot.nodes.push(n);
	        		/*} else {
	        			topRoot.nodes.push(n);*/
	        		}
	        	});
	        	
	        	$('#tree').treeview({
	        		data : [leftRoot/*, topRoot*/],
	        		levels: 2,
	        		color: '#ffffff',
	        		selectedBackColor: '#f5f5f5',
	        		selectedColor: '#666666',
	        		onhoverColor: '#003366'
	        	});
	        	
	        	$('#tree').on('nodeSelected', onNodeSelected);
	        	
	        	closeAjaxLoading();
	        },
	        complete:function(){
	        	//关闭覆盖层 loading
	        	closeAjaxLoading();
	        }
	    });
}

function onNodeSelected(){

}
/*
function viewResource(id){//查看
	var url=app.server.auth+"/resource/{id}";
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
				showViewResourceMoal(result.data);
			}
		},
		error:function(message){
			swal("获取数据失败","未能获取到数据,请重试","error");	
		}
	}); 
}
function showViewResourceMoal(data){//展示修改数据
	$('#viewResourceModal input').val("");
	$('#viewResourceModal #dialogTitle').text('查看角色');
   	$('#viewResourceModal').modal('show');
   	//$('#viewResourceModal #userName').attr('readonly','true');
   	//$('#viewResourceModal #userCode').attr('readonly','true');
   	//$('#viewResourceModal #userDesc').attr('readonly','true');
   	$('#viewResourceModal #userName').val(data.userName);
	$('#viewResourceModal #userNo').val(data.userNo);
   	$('#viewResourceModal #name').val(data.name);
}
function editResource(id){
	var url=app.server.auth+"/resources/{id}";
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
				showResourceMoal(result.data);
			}
		},
		error:function(message){
			swal("获取数据失败","未能获取到数据,请重试","error");	
		}
	}); 
}
function showResourceMoal(data){//展示修改数据
	$('#resourceModal input').val("");
	$('#resourceModal #dialogTitle').text('查看角色');
   	$('#resourceModal').modal('show');
   	$('#resourceModal #id').val(data.id);
   	$('#resourceModal #userNo').val(data.userNo);
   	$('#resourceModal #userName').val(data.userName);
   	$('#resourceModal #name').val(data.name);
}


function addTab(id){
	var url="modules/permissions/html/user-detail.html?id="+id;
	openTab(url);
}
*/


	