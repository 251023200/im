$(function(){
	initData();
	initMenuTree();
});
var SysMenuModel={};
function initData(){//初始化数据
}

function editMenu(){
	var nodes = $('#tree').treeview('getSelected');
	if (!nodes || nodes.length == 0) {
		swal('请选择一个菜单');
		return;
	}
	var node = nodes[0];
	if(node.parentId==undefined){
		swal('不能修改 系统管理 菜单');
		return;
	}
	var id=node.id;
	var url=app.server.auth+"/menus/{id}";
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
				showEditMenuView(result.data);
			}
		},
		error:function(message){
			handleError(message);
		}
	}); 
}

function addMenu(){//添加
	var nodes = $('#tree').treeview('getSelected');
	if (!nodes || nodes.length == 0) {
		swal('请选择一个菜单');
		return;
	}
	var parentNode = nodes[0];
	var parentId=undefined;
	if(parentNode.parentId==undefined){
		parentId = 0;
	}else{
		parentId=parentNode.id;
	}
	
	$('#add-menu-modal :text').val('');
	$('#add-menu-modal input[name="menu-parentId"]').val(parentId);
	$('#add-menu-modal #dialogTitle').text('新增菜单');
	initState(true);
   	$('#add-menu-modal').modal('show');
}

function showEditMenuView(data){
	$('#add-menu-modal').modal('show');
	$('#add-menu-modal #dialogTitle').text('修改菜单');
	$('#add-menu-modal input[name="menu-id"]').val(data.id);
	$('#add-menu-modal input[name="menu-parentId"]').val(data.parentId)
	$('#add-menu-modal input[name="menu-name"]').val(data.name);
	$('#add-menu-modal input[name="menu-url"]').val(data.url);
	$('#add-menu-modal input[name="menu-icon"]').val(data.icon);
	$('#add-menu-modal input[name="menu-seq"]').val(data.seq);
	$('#add-menu-modal input[name="menu-remark"]').val(data.remark);
	$('#add-menu-modal input[name="add-menu-parentId"]').val(data.parentId);
	if(data.active==1){
		initState(true);
	}else{
		initState(false);
	}
}

function saveMenu(){//保存
	var name=$('#add-menu-modal input[name="menu-name"]').val();
	var url=$('#add-menu-modal input[name="menu-url"]').val();
	var icon=$('#add-menu-modal input[name="menu-icon"]').val();
	var seq=$('#add-menu-modal input[name="menu-seq"]').val();
	var remark=$('#add-menu-modal input[name="menu-remark"]').val();
	var id=$('#add-menu-modal input[name="menu-id"]').val();
	var parentId=$('#add-menu-modal input[name="menu-parentId"]').val();
	if($('#add-menu-active').bootstrapSwitch('state')){
		var active = 1;
	}else{
		active = 0;
	}
	var param={
		'name':name,
		'url':url,
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
		url=app.server.auth+"/menus";	//POST url
		method="POST";
	}else{//修改
		url=app.server.auth+"/menus/{id}";	//PUT url
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
				var content='菜单已添加';
			}else{
				var title='成功';
				var content='菜单已修改';
			}
			swal({
				'title': title,
				'text': content,
				'type':'success'
			},function(){//刷新
				$('#add-menu-modal').modal('hide');
				initMenuTree();
			});
		},
		error:function(message){
			handleError(message);
		}
	}); 
}

function deleteMenu(id){//删除
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
		var url = app.server.auth + "/menus/{id}";
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
					intMenuTableList();
				});
			},
			error:function(message){
				handleError(message);
			}
		}); 
	});
}
function batchDeleteMenu(ids){//删除
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
		var url=app.server.auth+"/menus/batchDelete";
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
					initMenuTree();
				});
			},
			error:function(message){
				handleError(message);
			}
		}); 
	});
}

function initMenuTree(){
	$.ajax({
	    url: app.server.auth + "/menus/getTree",
	    method:'GET',
	    cache: false,
	    //beforeSend:ajaxLoading,// 开启loading
		success: function(res) {
			var leftRoot = {
	        	text: "系统管理",
	        	nodes: [],
	        	menuType: 0,
				//selectable:true,
	        };
	        /*	var topRoot = {
	        		text: "顶部菜单",
	        		nodes: [],
	        		menuType: 1
	        	};
	        	*/	
				
	        $.each(res.data, function(i, n) {
	        	if (n /*&& n.menuType == 0*/) {
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
	        	
	        $('#tree').on('nodeSelected', selectMenu);
	        
	        closeAjaxLoading();
	    },
	    complete:function(){
			//关闭覆盖层 loading
	        closeAjaxLoading();
		}
	});
}

function selectMenu(event,data){
	if (data.parentId === undefined) {	
		$('#menu-name').text('');
		$('#menu-url').text('');
		$('#menu-icon').text('');
		$('#menu-seq').text('');
		$('#menu-active').text('');
		$('#menu-remark').text('');
	} else{
		$('#menu-name').text(data.name);
		$('#menu-url').text(data.url);
		$('#menu-icon').text(data.icon);
		$('#menu-seq').text(data.seq);
		if (data.active == 1) {
			$('#menu-active').text('激活');
		} else {
			$('#menu-active').text('未激活');
		}
		$('#menu-remark').text(data.remark);
	}
}

function initState(status){
    /* 初始化状态 */  
	$("#add-menu-active").bootstrapSwitch({  
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
	$('#add-menu-active').bootstrapSwitch('state', status); // true || false
}  

/*
function viewMenu(id){//查看
	var url=app.server.auth+"/menu/{id}";
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
				showViewMenuMoal(result.data);
			}
		},
		error:function(message){
			swal("获取数据失败","未能获取到数据,请重试","error");	
		}
	}); 
}
function showViewMenuMoal(data){//展示修改数据
	$('#viewMenuModal input').val("");
	$('#viewMenuModal #dialogTitle').text('查看角色');
   	$('#viewMenuModal').modal('show');
   	//$('#viewMenuModal #userName').attr('readonly','true');
   	//$('#viewMenuModal #userCode').attr('readonly','true');
   	//$('#viewMenuModal #userDesc').attr('readonly','true');
   	$('#viewMenuModal #userName').val(data.userName);
	$('#viewMenuModal #userNo').val(data.userNo);
   	$('#viewMenuModal #name').val(data.name);
}
function editMenu(id){

*/


	