$(function(){
	initData();
	initRoleView();
});
var SysRoleModel={};
function initData(){//初始化数据
	SysRoleModel.queryString=getQueryString();
	SysRoleModel.search={};
}
function initRoleView(id){
	var id=SysRoleModel.queryString['id'];
	var url=app.server.auth+"/roles/{id}";
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
			console.log(result);
			if(result.code==0){
				showRoleView(result.data);
			}
		},
		error:function(message){
			handleError(message);
		}
	}); 
}
function showRoleView(data){//展示修改数据
	$('input').val("");
   	$('#id').val(data.id);
   	$('#roleName').val(data.name);
   	$('#roleCode').val(data.code);
   	$('#roleDesc').val(data.description);
}

function saveRole(){//保存
	var roleCode=$('#roleCode').val();
	var roleName=$('#roleName').val();
	var roleDesc=$('#roleDesc').val();
	var id=$('#id').val();
	var param={
		'code':roleCode,
		'name':roleName,
		'description':roleDesc
	};
	var url=app.server.auth+"/roles/{id}";	//PUT url
	url=url.replace("{id}",id);
	var method="PUT";
	
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
			var content='角色已修改';
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

