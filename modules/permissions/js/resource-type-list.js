$(function(){
	initData();
	initResourceTypeTree();
});

var SysResourceTypeModel={};
function initData(){//初始化数据
}

function editResourceType(){
	var nodes = $('#tree').treeview('getSelected');
	if (!nodes || nodes.length == 0) {
		swal('请选择一个资源类别');
		return;
	}
	var node = nodes[0];
	if(node.parentId==undefined){
		swal('不能修改 系统管理 资源类别');
		return;
	}
	var id=node.id;
	var url=app.server.auth+"/resourceTypes/{id}";
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
			console.log(result);
			if(result.code==0){
				showEditResourceTypeView(result.data);
			}else{
				swal("获取数据失败","未能获取到数据,请重试","error");	
			}
		},
		error:function(message){
			handleError(message);
		}
	}); 
}

function addResourceType(){//添加
	var nodes = $('#tree').treeview('getSelected');
	if (!nodes || nodes.length == 0) {
		swal('请选择一个资源类别');
		return;
	}
	var parentNode = nodes[0];
	var parentId=undefined;
	if(parentNode.parentId==undefined){
		parentId = 0;
	}else{
		parentId=parentNode.id;
	}
	//alert("parentId="+parentId);
	$('#add-resource-type-modal :text').val('');
	$('#add-resource-type-modal input[name="resource-type-Id"]').val('');
	$('#add-resource-type-modal input[name="resource-type-parentId"]').val(parentId);
	$('#add-resource-type-modal #dialogTitle').text('新增资源类别');
	initState(true);
   	$('#add-resource-type-modal').modal('show');
}

function showEditResourceTypeView(data){
	$('#add-resource-type-modal').modal('show');
	$('#add-resource-type-modal #dialogTitle').text('修改资源类别');
	$('#add-resource-type-modal input[name="resource-type-id"]').val(data.id);
	$('#add-resource-type-modal input[name="resource-type-parentId"]').val(data.parentId)
	$('#add-resource-type-modal input[name="resource-type-name"]').val(data.name);
	$('#add-resource-type-modal input[name="resource-type-code"]').val(data.code);
	$('#add-resource-type-modal input[name="resource-type-icon"]').val(data.icon);
	$('#add-resource-type-modal input[name="resource-type-seq"]').val(data.seq);
	$('#add-resource-type-modal input[name="resource-type-remark"]').val(data.remark);
	$('#add-resource-type-modal input[name="add-resource-type-parentId"]').val(data.parentId);
	if(data.active==1){
		initState(true);
	}else{
		initState(false);
	}
}

function saveResourceType(){//保存
	var name=$('#add-resource-type-modal input[name="resource-type-name"]').val();
	var code=$('#add-resource-type-modal input[name="resource-type-code"]').val();
	var icon=$('#add-resource-type-modal input[name="resource-type-icon"]').val();
	var seq=$('#add-resource-type-modal input[name="resource-type-seq"]').val();
	var remark=$('#add-resource-type-modal input[name="resource-type-remark"]').val();
	var id=$('#add-resource-type-modal input[name="resource-type-id"]').val();
	var parentId=$('#add-resource-type-modal input[name="resource-type-parentId"]').val();
	if($('#add-resource-type-active').bootstrapSwitch('state')){
		var active = 1;
	}else{
		active = 0;
	}
	var param={
		'name':name,
		'code':code,
		'icon':icon,
		'seq':seq,
		'active':active,
		'remark':remark,
		'parentId':parentId
	};
	var url=undefined;
	var method=undefined;
	var isAddOp=false;
	if(id==undefined||id.trim()=='')isAddOp=true;
	if(isAddOp){//添加
		url=app.server.auth+"/resourceTypes";	//POST code
		method="POST";
	}else{//修改
		url=app.server.auth+"/resourceTypes/{id}";	//PUT code
		url=code.replace("{id}",id);
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
			console.log(result);
			if(isAddOp){
				var title='成功';
				var content='资源类别已添加';
			}else{
				var title='成功';
				var content='资源类别已修改';
			}
			swal({
				'title': title,
				'text': content,
				'type':'success'
			},function(){//刷新
				$('#add-resource-type-modal').modal('hide');
				//initResourceTypeTree();
				if(isAddOp){//在资源类别节点下添加子节点
					var newNode = {
						id : result.data.id,
						text : param.name,
						href : param.code,
						icon : param.icon,
						seq : param.seq,
						active: param.active,
						remark: param.remark,
						parentId : param.parentId,
						nodes : undefined
					};
					//var parentNode = $('#tree').treeview('getNode',parentId);
					var nodes = $('#tree').treeview('getSelected');
					var parentNode = nodes[0];
					//alert(parentId+'---'+parentNode.text);
					console.log(parentNode);
					parentNode.nodes= parentNode.nodes || [];
					parentNode.nodes.push(newNode);
					$("#tree").treeview("addNode", [newNode,parentNode, { silent: true }]); 
				}
			});
		},
		error:function(message){
			handleError(message);
		}
	}); 
}


function deleteResourceType(){//删除
	var nodes = $('#tree').treeview('getSelected');
	if (!nodes || nodes.length == 0) {
		swal('请选择一个资源类别');
		return;
	}
	var node = nodes[0];
	var id = node.id;
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
		var url = app.server.auth + "/resourceTypes/{id}";
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
					$('#tree').treeview('removeNode', [ nodes, { silent: true } ]);
				});
			},
			error:function(message){
				handleError(message);
			}
		}); 
	});
}
function batchDeleteResourceType(ids){//删除
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
		var url=app.server.auth+"/resourceTypes/batchDelete";
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
					initResourceTypeTree();
				});
			},
			error:function(message){
				handleError(message);
			}
		}); 
	});
}

function initResourceTypeTree1(){
	var resourceTypes = [{"id":1},{"id":2},{"id":3,"children":[{"id":4},{"id":5}]}] 
	$('#tree').nestable({
		//data:resourceTypes
	});
}

function initResourceTypeTree(){
	$.ajax({
	    url: app.server.auth + "/resourceTypes/getTree",
	    method:'GET',
	    cache: false,
		headers:{
			"Authorization":"Bearer "+Token.getAccessToken(),
		},
	    //beforeSend:ajaxLoading,// 开启loading
		success: function(res) {
			var leftRoot = {
	        	text: "系统资源类别",
				nodeId: '0',
				id : '0',
	        	nodes: [],
	        	//menuType: 0,
				state : {
					selected:true,
					expanded:true
				},
				selectable:false
	        };
	        /*	var topRoot = {
	        		text: "顶部资源类别",
	        		nodes: [],
	        		menuType: 1
	        	};
	        	*/	
				
	        $.each(res.data, function(i, n) {
	        	if (n /*&& n.menuType == 0*/) {
					formatResourceType(n);
	        		leftRoot.nodes.push(n);
	        	/*} else {
	        		topRoot.nodes.push(n);*/
	        	}
	        });
	        
	        $('#tree').treeview({
	        	data : [leftRoot/*, topRoot*/],
	        	levels: 2,
	        	//color: '#ffffff',
	        	//selectedBackColor: '#f5f5f5',
	        	//selectedColor: '#666666',
	        	//onhoverColor: '#003366'
	        });
	        
	        $('#tree').on('nodeSelected', selectResourceType);
	        
	        closeAjaxLoading();
	    },
	    complete:function(){
			//关闭覆盖层 loading
	        closeAjaxLoading();
		}
	});
}

function formatResourceType(resourceType){
	resourceType.nodeId = resourceType.id;
	if(resourceType.nodes!=undefined && resourceType.nodes.length>0){//非叶子节点
		resourceType.state = resourceType.state || {};
		//resource-type.selectable = false;
		for(var i=0;i<resourceType.nodes.length;i++){
			formatResourceType(resourceType.nodes[i]);
		}
	}else{
		delete resourceType.nodes;
		resourceType.state = resourceType.state || {};
	}
}

function selectResourceType(event,data){
	if (data.parentId === undefined) {	
		$('#resource-type-name').text('');
		$('#resource-type-code').text('');
		$('#resource-type-icon').text('');
		$('#resource-type-seq').text('');
		$('#resource-type-active').text('');
		$('#resource-type-remark').text('');
	} else{
		$('#resource-type-name').text(data.name);
		$('#resource-type-code').text(data.code);
		$('#resource-type-icon').text(data.icon);
		$('#resource-type-seq').text(data.seq);
		if (data.active == 1) {
			$('#resource-type-active').text('激活');
		} else {
			$('#resource-type-active').text('未激活');
		}
		$('#resource-type-remark').text(data.remark);
	}
}

function initState(status){
    /* 初始化状态 */  
	$("#add-resource-type-active").bootstrapSwitch({  
        onText : "开启",      // 设置ON文本  
        offText : "关闭",    // 设置OFF文本  
        onColor : "success",// 设置ON文本颜色     (info/success/warning/danger/primary)  
        offColor : "info",  // 设置OFF文本颜色        (info/success/warning/danger/primary)  
        size : "normal",    // 设置控件大小,从小到大  (mini/small/normal/large)   
        onSwitchChange : function(event, state) {  // 当开关状态改变时触发   
            if (state == true) {  
                //alert("ON");  
            } else {  
                //alert("OFF");  
            }  
        }  
    });  
	$('#add-resource-type-active').bootstrapSwitch('state', status); // true || false
}  

/*
function viewResourceType(id){//查看
	var code=app.server.auth+"/resource-type/{id}";
	code = code.replace("{id}",id);
	$.ajax({
		type:"GET",
		code:code,
		contentType:"application/json",
		//data:JSON.stringify(param),
		dataType:"json",
		success:function(result){
			//console.log(result);
			if(result.code==0){
				showViewResourceTypeMoal(result.data);
			}
		},
		error:function(message){
			swal("获取数据失败","未能获取到数据,请重试","error");	
		}
	}); 
}
function showViewResourceTypeMoal(data){//展示修改数据
	$('#viewResourceTypeModal input').val("");
	$('#viewResourceTypeModal #dialogTitle').text('查看角色');
   	$('#viewResourceTypeModal').modal('show');
   	//$('#viewResourceTypeModal #userName').attr('readonly','true');
   	//$('#viewResourceTypeModal #userCode').attr('readonly','true');
   	//$('#viewResourceTypeModal #userDesc').attr('readonly','true');
   	$('#viewResourceTypeModal #userName').val(data.userName);
	$('#viewResourceTypeModal #userNo').val(data.userNo);
   	$('#viewResourceTypeModal #name').val(data.name);
}
function editResourceType(id){

*/


	