$(function(){
	initData();
	initMenuTree();
	//initNestable();
});

var SysMenuModel={};
function initData(){//初始化数据
}

//测试用 菜单格式必须满足以下
function initNestable(){
	var menus = [{
		'id' : 'id-1',
		'text' : 'name-1',
		'url' : 'http://wwww.baidu.com',
		'nodes' : [{
			'id': 'id-1-1',
			'text': 'name-1-1',
			'url':'http://wwww.sohu.com',
			'nodes':{
				'id' : 'id-1-1-1',
				'text' : 'name-1-1-1',
				'url':'http://wwww.sina.com'
			}
		},{
			'id':'id-1-2',
			'text':'name-1-2',
			'url':'http://wwww.baidu.com'
		}]
	}];
	render(menus);
	
}

function render(menus){
	//不加虚拟根节点
	//var html = generateMenus(menus);
	
	//添加虚拟根节点
	var html = generateMenusWithVirtualRoot(menus);
	
	$('#tree').html(html).nestable('serialize');
	//$('#tree').nestable('serialize');   
}

function generateMenusWithVirtualRoot(menus){
	var html ='<ol class="dd-list">';
	html += '<li id="0" class="dd-item dd-nodrag" data-id="0">';
	html += '<div class="dd-handle">';
	html += '<span class="menu-title">' + '系统菜单' + '</span>';
	html += '<span class="pull-right">';
	html += '<a href="#" onclick="addMenu(\'0\')"><i class="fa fa-plus fa-lg add-op-icon"></i></a>';
	html += '</span>';
	html += '</div>'; 
	if(menus!=undefined&&menus.length>0){
		html += generateMenus(menus);
	}
	html +='</li>';
	html += '</ol>';  
	return html;
}

function generateMenus(menus){
	var html ='<ol class="dd-list">';
	for(var i=0;i<menus.length;i++){
		html += generateMenu(menus[i]);
	}
	html += '</ol>';  
	return html;
}

function generateMenu(menu){
	var id=menu.id;
	var text=menu.text;
	var url = menu.url;
	var nodes = menu.nodes;
	var html = '<li id="'+id+'" class="dd-item dd-nodrag" data-id="'+ id +'">';
	html += '<div class="dd-handle">';
	html += '<span class="menu-title">' + text + '</span>';
	html += '<span class="pull-right">';
	html += '<a href="#" onclick="addMenu(\''+ id +'\')"><i class="fa fa-plus fa-lg add-op-icon"></i></a>';
	html += '<a href="#" onclick="editMenu(\''+ id +'\')"><i class="fa fa-edit fa-lg edit-op-icon"></i></a>';
	html += '<a href="#" onclick="deleteMenu(\''+ id +'\')"><i class="fa fa-trash-o fa-lg del-op-icon"></i></a>';
	html += '</span>';
	html += '</div>';  
	if(nodes!=undefined && nodes.length>0){
		html += generateMenus(nodes);
	}
	html += '</li>';
	return html;
}

function addMenu(parentId){//添加
	recordPosition(parentId);
	//alert("parentId="+parentId);
	$('#add-menu-modal :text').val('');
	$('#add-menu-modal input[name="menu-Id"]').val('');
	$('#add-menu-modal input[name="menu-parentId"]').val(parentId);
	$('#add-menu-modal #dialogTitle').text('新增菜单');
	initState(true);
   	$('#add-menu-modal').modal('show');
}

var pos=undefined;
function recordPosition(id){
	alert(id+'--');
	var selector='#'+id;
	pos=$(selector).offset();
	alert(pos.top);
}
function scrollTo(id){
	//$('body html').offset(pos);
	alert(id+'--'+pos.top)
	var selector='#'+id;
	//$(selector).offset(pos);
	$("body,html").animate({ 
		scrollTop: pos.top - 70 
	}, 0); 
}

function generateChild(menu){
	var html = '<li id="'+menu.id+'" class="dd-item dd-nodrag " data-id="'+menu.id+'">';  
	html += '<div class="dd-handle dd-nodrag">';
	html +=	'<span class="menu-title">'+menu.text+'</span>';
	html += '<span class="pull-right">';
	html += '<a href="#" onclick="addMenu(\''+menu.id+'\')"><i class="fa fa-plus fa-lg add-op-icon"></i></a>' + '&nbsp;';
	html += '<a href="#" onclick="editMenu(\''+menu.id+'\')"><i class="fa fa-edit fa-lg edit-op-icon"></i></a>' + '&nbsp;';
	html += '<a href="#" onclick="deleteMenu(\''+menu.id+'\')"><i class="fa fa-trash-o fa-lg del-op-icon"></i></a>' + '&nbsp;';
	html += '</span>';
	html += '</div>';
	html += '</li>';
	return html;
}

function generateChildren(menu){
	var html = '<ol class="dd-list">';  
	html += '<li id="'+menu.id+'" class="dd-item dd-nodrag " data-id="'+menu.id+'">';  
	html += '<div class="dd-handle dd-nodrag">';
	html +=	'<span class="menu-title">'+menu.text+'</span>';
	html += '<span class="pull-right">';
	html += '<a href="#" onclick="addMenu(\''+menu.id+'\')"><i class="fa fa-plus fa-lg add-op-icon"></i></a>';
	html += '<a href="#" onclick="editMenu(\''+menu.id+'\')"><i class="fa fa-edit fa-lg edit-op-icon"></i></a>';
	html += '<a href="#" onclick="deleteMenu(\''+menu.id+'\')"><i class="fa fa-trash-o fa-lg del-op-icon"></i></a>';
	html += '</span>';
	html += '</div>';
	html += '</li>';
	html += '</ol>';
	return html;
}


function editMenu(id){
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
			console.log(result);
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
				//initMenuTree();
				var newNode = {
					id : result.data.id,
					text : param.name,
					url : param.url,
					icon : param.icon,
					seq : param.seq,
					active: param.active,
					remark: param.remark,
					parentId : param.parentId,
					nodes : undefined
				};
				if(isAddOp){//在菜单节点下添加子节点
					addMenu0(newNode.parentId,newNode);
					scrollTo(param.parentId);
				}else{//修改title
					editMenu0(id,newNode);
				}
				
			});
		},
		error:function(message){
			handleError(message);
		}
	}); 
}
function addMenu0(id,menu){
	var parent_selector = '#'+id;
	var ol_selector = parent_selector + '>ol';
	var ol = $(ol_selector);
	if(ol.length==0){//没有子
		var new_ol = generateChildren(menu);
		$(parent_selector).append(new_ol);

		var html = '<button data-action="collapse" type="button" >关闭</button>';
		html +='<button data-action="expand" type="button" style="display:none">展开</button>';
		$(parent_selector).prepend(html);
	}else{//有子
		var new_li = generateChild(menu);
		$(ol_selector).append(new_li);

		$(parent_selector).children('[data-action="collapse"]').css('display','block');
		$(parent_selector).children('[data-action="expand"]').css('display','none');
		$(ol_selector).show();
	}
}
function editMenu0(id,menu){
	//alert('-编辑子菜单 ' + id);
	var selector = '#{menuId}>div>span.menu-title'.replace("{menuId}",id);
	$(selector).text(menu.text);
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
		//var url = app.server.auth + "/menus/{id}";
		var url = app.server.auth + "/menus/{id}/cascade"; //删除菜单及其子孙
		url = url.replace("{id}",id);
		$.ajax({
			type:"DELETE",
			url:url,
			contentType:"application/json",
			dataType:"json",
			headers:{
				"Authorization":"Bearer "+Token.getAccessToken(),
			},
			headers:{
				"Authorization":"Bearer "+Token.getAccessToken(),
			},
			success:function(result){
				swal({
					'title':'删除成功',
					'text': '资源已删除',
					'type':'success'
				},function(){//刷新
					deleteMenu0(id);
				});
			},
			error:function(message){
				handleError(message);
			}
		}); 
	});
}
function deleteMenu0(id){
	var selector = '#'+id;
	var siblings = $(selector).siblings();
	if(siblings.length==0){//没有兄弟了， 移除ol
		var parent = $(selector).parent();	//ol
		var grandParent = parent.parent();  //li
		parent.remove();
		grandParent.children("button").remove(); //移除 扩展 收缩 按钮
	}else{//移除自己
		$(selector).remove();
	}
}

function initMenuTree(){
	$.ajax({
	    url: app.server.auth + "/menus/getTree",
	    method:'GET',
	    cache: false,
		headers:{
			"Authorization":"Bearer "+Token.getAccessToken(),
		},
	    //beforeSend:ajaxLoading,// 开启loading
		success: function(res) {
			//var menus = format(res.data);
	        render(res.data);
	       // closeAjaxLoading();
	    },
	    complete:function(){
			//关闭覆盖层 loading
	       // closeAjaxLoading();
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
	