$(function(){
	initData();
	initApplicationTableList();
});
var SysApplicationModel={};
function initData(){//初始化数据
	SysApplicationModel.search={};
}
function searchApplication(){//查询
	SysApplicationModel.search.applicationName=$("#applicationName").val();
	initApplicationTableList();
}
function clearCondtion(){//重置
	$("#applicationName").val("");
	delete SysApplicationModel.search.applicationName;
	initApplicationTableList();
}
function initApplicationTableList(){
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
			var url=app.server.auth+"/applications/search?pageNum={pageNum}&pageSize={pageSize}";
		   	url = url.replace("{pageNum}",pageNum).replace("{pageSize}",pageSize);
		 	
		 	var param = {
		 		"name" : SysApplicationModel.search.applicationName,
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
					var str='';
	        		// str += '<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="viewApplication(\''+data+'\')">查看</a>&nbsp;';
        		    str+='<a class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="editApplication(\''+data+'\')">编辑</a>&nbsp;';
					str += '<a  class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="editApplicationMenus(\''+data+'\')">管理菜单</a>&nbsp;';
					str += '<a  class="like btn btn-primary btn-xs" href="javascript:void(0)" title="Like" onclick="editApplicationOperations(\''+data+'\')">管理操作</a>&nbsp;';
        		    //str += '<a  class="remove btn btn-danger btn-xs" href="javascript:void(0)" title="Like" onclick="editApplicationPermission(\''+data+'\')">配置权限</a>&nbsp;';
        		    str += '<a  class="remove btn btn-danger btn-xs" href="javascript:void(0)" title="Remove" onclick="deleteApplication(\''+data+'\')">删除</a>';
        		   return str;
	        	}
	        },]
		});
}

function viewApplication(id){
	var url="modules/permissions/html/application-info.html?id="+id;
	//alert(url);
	openTab(url,'应用信息');
}

/*
function editApplication(id){
	var url="modules/permissions/html/application-edit.html?id="+id;
	openTab(url,'修改应用');
}
*/

function editApplicationMenus(id){
	var url="modules/permissions/html/application-menu.html?id="+id;
	openTab(url,'配置菜单');
}

function editApplicationOperations(id){//管理应用(id)的操作
	var url="modules/permissions/html/application-operation-list.html?appId="+id;
	openTab(url,'配置应用操作');
}

/*
function editApplicationPermission(id){
	var url="modules/permissions/html/application-operation.html?id="+id;
	openTab(url,'管理应用');
}
*/

function  addApplication(){//添加
	$('#upsert-application-modal input').val("");
	$('#upsert-application-modal #dialogTitle').text('新增应用');
   	$('#upsert-application-modal').modal('show');
}
function saveApplication(){//保存
	var applicationCode=$('#upsert-application-code').val();
	var applicationName=$('#upsert-application-name').val();
	var applicationDesc=$('#upsert-application-desc').val();
	var id=$('#upsert-application-id').val();
	var param={
		'code':applicationCode,
		'name':applicationName,
		'description':applicationDesc
	};
	var url=undefined;
	var method=undefined;
	var isAddOp=false;
	if(id==undefined||id.trim()=='')isAddOp=true;
	if(isAddOp){//添加
		//alert('添加' + id);
		url=app.server.auth+"/applications";	//POST url
		method="POST";
		//alert('post');
	}else{//修改
		//alert('修改' + id);
		url=app.server.auth+"/applications/{id}";	//PUT url
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
					$('#upsert-application-modal').modal('hide');
					initApplicationTableList();
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
function deleteApplication(id){//删除
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
		var url = app.server.auth + "/applications/{id}";
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
					'text': '应用已删除',
					'type':'success'
				},function(){//刷新
					initApplicationTableList();
				});
			},
			error:function(message){
				handleError(message);
			}
		}); 
	});
}
function batchDeleteApplication(ids){//删除
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
		var url=app.server.auth+"/application/batchDelete";
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
					'text': '应用已删除',
					'type':'success'
				},function(){//刷新
					initApplicationTableList();
				});
			},
			error:function(message){
				handleError(message);
			}
		}); 
	});
}

function editApplication(id){//编辑
	var url=app.server.auth+"/applications/{id}";
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
				showApplicationEditView(result.data);
			}else{
				swal("获取数据失败","未能获取到数据,请重试","error");		
			}
		},
		error:function(message){
			handleError(message);	
		}
	}); 
}

function showApplicationEditView(data){//展示修改数据
	$('#upsert-application-modal input').val("");
	$('#upsert-application-modal #dialogTitle').text('编辑应用');
   	$('#upsert-application-modal').modal('show');
   	$('#upsert-application-id').val(data.id);
   	$('#upsert-application-name').val(data.name);
   	$('#upsert-application-code').val(data.code);
   	$('#upsert-application-desc').val(data.description);
}
