$(function(){
	initData();
	initPermissionInfo();
	initMenuTree();
});
var SysPermissionMenuModel={};
function initData(){//初始化数据
	SysPermissionMenuModel.search={};
	SysPermissionMenuModel.queryString=getQueryString();
}
function initPermissionInfo(id){//查看
	var id=SysPermissionMenuModel.queryString['id'];
	var url=app.server.auth+"/permissions/{id}";
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
				showPermissionInfo(result.data);
			}
		},
		error:function(message){
			handleError(message);
		}
	}); 
}
function showPermissionInfo(permission){
	$('#permissionInfo #permissionCode').val(permission.code);
	$('#permissionInfo #permissionName').val(permission.name);
	$('#permissionInfo #permissionDesc').val(permission.description);
}

function initMenuTree(){
	var id = SysPermissionMenuModel.queryString['id'];
	var url = app.server.auth + "/permissions/{permissionId}/menus/tree";
	url = url.replace("{permissionId}",id);
	$.ajax({
	    url: url,
	    method:'GET',
	    cache: false,
		headers:{
			"Authorization":"Bearer "+Token.getAccessToken(),
		},
	    //beforeSend:ajaxLoading,// 开启loading
		success: function(res) {
	        $.each(res.data, function(i, menu) {
				formatMenu(menu);
	        });
			console.log('-----')
			console.log(res.data);
	        $('#menu-tree').treeview({
				showCheckbox: true,
				data:res.data,
	        	levels: 2,
				onNodeChecked:nodeChecked,
				onNodeUnchecked:nodeUnchecked,
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

function formatMenu(menu){
	menu.nodeId = menu.id;
	if(menu.nodes!=undefined && menu.nodes.length>0){//非叶子节点
		menu.state = menu.state || {};
		if(menu.assigned==1){
			menu.state.checked = true;
		}else{
			menu.state.checked = false;
		}
		menu.selectable = false;
		for(var i=0;i<menu.nodes.length;i++){
			formatMenu(menu.nodes[i]);
		}
	}else{
		delete menu.nodes;
		menu.state = menu.state || {};
		if(menu.assigned==1){
			menu.state.checked = true;
		}else{
			menu.state.checked = false;
		}
	}
}


var nodeCheckedSilent = false;
function nodeChecked(event, node) {
    if (nodeCheckedSilent) {
        return;
    }
    nodeCheckedSilent = true;
    checkAllParent(node);
    checkAllSon(node);
    nodeCheckedSilent = false;
}

var nodeUncheckedSilent = false;
function nodeUnchecked(event, node) {
    if (nodeUncheckedSilent)return;
    nodeUncheckedSilent = true;
    uncheckAllParent(node);
    uncheckAllSon(node);
    nodeUncheckedSilent = false;
}

//选中全部父节点  
function checkAllParent(node) {
	if(node==undefined)return;
	console.log('checkParent : '+node.nodeId + '---->' + node.text)
    $('#menu-tree').treeview('checkNode', node.nodeId, {
		silent: true
    });
    var parentNode = $('#menu-tree').treeview('getParent', node.nodeId);
    if (parentNode==undefined || !("nodeId" in parentNode)) {
        return;
    } else {
        checkAllParent(parentNode);
    }
}
 //取消全部父节点  
 function uncheckAllParent(node) {
    $('#menu-tree').treeview('uncheckNode', node.nodeId, {
        silent: true
    });
    var siblings = $('#menu-tree').treeview('getSiblings', node.nodeId);
    var parentNode = $('#menu-tree').treeview('getParent', node.nodeId);
    if (parentNode==undefined || !("nodeId" in parentNode)) {
        return;
    }
    var isAllUnchecked = true; //是否全部没选中  
	for(var i=0;i<siblings.length;i++){
		if (siblings[i].state.checked) {
			isAllUnchecked = false;
			break;
		}
	}
    if (isAllUnchecked) {
        uncheckAllParent(parentNode);
    }
}

//级联选中所有子节点  
function checkAllSon(node) {
	if(node==undefined)return;
    $('#menu-tree').treeview('checkNode', node.nodeId, {
        silent: true
    });
    if (node.nodes != null && node.nodes.length > 0) {
		console.log('子节点数 ' +node.nodes.length)
		for(var i=0;i<node.nodes.length;i++){
			checkAllSon(node.nodes[i]);
		}
    }
}
//级联取消所有子节点  
function uncheckAllSon(node) {
    $('#menu-tree').treeview('uncheckNode', node.nodeId, {
        silent: true
    });
    if (node.nodes != null && node.nodes.length > 0) {
		for(var i=0;i<node.nodes.length;i++){
			uncheckAllSon(node.nodes[i]);
		}
    }
 }
 
 function saveMenu(){
	var nodes = $('#menu-tree').treeview('getChecked');
	var menuIds = [];
	for(var i=0;i<nodes.length;i++){
		console.log(nodes[i].text + " --- " + nodes[i].id)
		menuIds.push(nodes[i].id);
	}
	var id=SysPermissionMenuModel.queryString['id'];
	var url = app.server.auth+"/permissions/{permissionId}/menus";
	url = url.replace('{permissionId}',id);
	var method = "PUT";
	$.ajax({
		type:method,
		url:url,
		contentType:"application/json",
		data:JSON.stringify(menuIds),
		dataType:"json",
		headers:{
			"Authorization":"Bearer "+Token.getAccessToken(),
		},
		success:function(result){
			if(result.code==0){
				swal({
				'title': '成功',
				'text': '角色对应菜单已修改',
				'type':'success'
				},function(){//刷新
					//initMenuTree();
				});
			}
			
		},
		error:function(message){
			handleError(message);
		}
	}); 
}
