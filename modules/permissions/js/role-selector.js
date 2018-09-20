jQuery.roleSelector = (function($) {
	var _htmlUrl="/modules/permissions/html/role-selector.html";
	var _element = '#role-selector';
	//var _role_url = app.server.auth + '/roles?token='+getToken();
	var _role_url = app.server.auth + '/roles/search';
	var _callback = null;
	var _originSelectedIds = [];
	var _toSelectedIds = [];
	var _toSelected = {};
	var currentPageIds = []; //当前页的id
	var currentPageData = {};//保存每页返回的数据
	var _modal = null;
	var _hiddeCallBack = null;
	var searchObj={};//查询对象
	
	var _singleSelectFlag = true;
	var _init = function() {
		var dtd = $.Deferred();
		
		if (_modal) {
			dtd.resolve();
			return dtd.promise();
		}
		
		$.get({
			url:_htmlUrl, 
			method: 'GET',
			dataType: 'html',
			headers:{
				"Authorization":"Bearer "+Token.getAccessToken(),
			},
			success: function(data) {
				$('body').append(data);
				_modal = $(_element);
				//preprocessI18n(_modal);
				_modal.modal({backdrop: 'static', show: false});
				// Submit
				_modal.find('.btn.submit').click(function() {
					var res = [];
					for(var i=0;i<_toSelectedIds.length;i++){
						res.push(_toSelected[_toSelectedIds[i]]);
					}
					//console.log(res);
					_modal.modal('hide');
					_callback(res);
					/*
					var row = _modal.find('.table').bootstrapTable('getSelections');
					_modal.modal('hide');
					if(row.length==0){
						return ;
					}
					_callback(
						row[0]//rows// edit by cjl
					);
					*/
				});
				_modal.find('#searchBtn').click(function(){//搜索
					searchObj.name = _modal.find('#roleName').val();
					loadRole();
				});
				_modal.find('#clearCondtion').click(function(){//重置
					var name = _modal.find('#roleName').val('');
					searchObj.name=undefined;
					delete searchObj.name;
					loadRole();
				});
			
			
				//显示对话框调用的方法
				_modal.on('shown.bs.modal', function() {
					_modal.find('#checkAll').click(function () {//全选
						if (this.checked) {
							$(this).attr('checked','checked')
							$("input[name='item']").each(function () {
								this.checked = true;
							});
							//for(var i=0;i<currentPageData)
						} else {
							$(this).removeAttr('checked')
							$("input[name='item']").each(function () {
								this.checked = false;
							});
						}
					});
				});
			
				//关闭对话框调用的方法
				_modal.on('hidden.bs.modal', function() {
					if(typeof(_hiddeCallBack) == "function") {
						_hiddeCallBack();
					}
				});
				dtd.resolve();
			}
		});
		return dtd.promise();
	};
	
	//加载角色
	var loadRole = function(){
		$('#role-selector-table').dataTable({
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
			"sDom":'rt<"clear"><"bottom"ip<"clear">>',
			"info":true,
			// "processing": true,
			"pagingType": "full_numbers",
			//"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
			"lengthMenu": [[5,10], [5,10]],
			"serverSide": true,
			"bFilter": false, //过滤功能  
			"bSort": false, //排序功能  
			"sProcessing": "<img src='../img/loading.gif'/>",
			"ajax" :function(data,callback,settings){
				var pageSize = data.length;
				var pageNum = data.start/data.length+1;;
				//var url=app.server.auth+"/roles/search?pageNum={pageNum}&pageSize={pageSize}";
				var url = _role_url;
				if(url.indexOf('?')>=0){
					url += '&pageNum={pageNum}&pageSize={pageSize}';
				}else{
					url += '?pageNum={pageNum}&pageSize={pageSize}';
				}
				url = url.replace("{pageNum}",pageNum).replace("{pageSize}",pageSize);
				var param = {
					"name" : searchObj.name
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
						res.recordsTotal=result.data.total;
						res.recordsFiltered = result.data.total;
						res.data=result.data.list;
						saveCurrentPageData(result.data.list);
						callback(res);
					},
					error:function(message){
						handleError(message);
					}
				});   
			},
			"columns":[{
				"sClass": "text-center",
				"render": function (vdata, type, full, meta) {
					//return "<div align='center'><input type='checkbox' onclick = checkItem() name='ckb-jobid' value=''" + full.id + "></div>" ;
					return '<div align="center"><input type="checkbox" name="item" class="checkchild" value="'+full.id+'" /></div>';
					//return '<input type="checkbox" name="item" class="checkchild" value="'+full.id+'")/>';
				},
				"bSortable": false
			},{ 
				"data": "code"
			},{
				"data": "name"
			},{
				"data": "description"
			}],
			"fnDrawCallback": function () {
				bindEvent();
				checkSelected();
            },
		});
		
	}
	
	var saveCurrentPageData=function(datalist){
		currentPageIds = [];
		currentPageData = {};
		for(var i=0;i<datalist.length;i++){
			var data=datalist[i];
			currentPageIds.push(data.id)
			currentPageData[data.id]=data;	//map id->{}
		}
	}
	
	var bindEvent=function(){
		_modal.find('.checkchild').click(function(){
			var id = $(this).val();
			console.log(id);
			console.log(_toSelectedIds)
			if($(this).is(":checked") == false) {//移除
				$("#checkAll").prop("checked", false);
				if(_toSelectedIds.contains(id)){
					_toSelectedIds.remove(id);
					_toSelected[id] = undefined;
				}
			}else{//添加
				if(!_toSelectedIds.contains(id)){
					console.log('已经添加'+id)
					_toSelectedIds.push(id);
					_toSelected[id]=currentPageData[id];//设置
				}
			}
		});
	}
	
	var checkSelected=function(){
		alert('check')
		$("input[name='item']").each(function () {
			var id = $(this).val();
			//alert(id);
			console.log(id);
			console.log(_toSelectedIds)
			if(_toSelectedIds.contains(id)){
				console.log('true')
				this.checked = true;
			}else{
				console.log('false')
				this.checked = false;
			}
		});
	}
	
	/* Public function */
	/**
	 * originSelected: [{'id':'xxx','code':'xxx','name':'xxx','description':'xxx'},...]
	 */
	var show = function(callback,originSelected,url) {
		console.log('show----')
		console.log(originSelected)
		_callback = callback;
		_toSelectedIds=[];
		if(originSelected!=undefined && (originSelected instanceof Array)){
			_originSelectedIds = originSelected;
			for(var i=0;i<originSelected.length;i++){
				_toSelectedIds.push(originSelected[i].id);
				_toSelected[originSelected[i].id]=originSelected[i];
			}
		}
		console.log(_toSelected)
		_init().done(function(){
			if(url!=null){
				_role_url=url;
			}
			_modal.modal('show');
			loadRole();
		});
	};

	return {
		show: show,
	};
	
})(jQuery);
