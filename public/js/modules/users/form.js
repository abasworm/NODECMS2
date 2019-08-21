$(document).ready(function(e){
	//ADD
	$('#alertbox').hide();
	$('#closeAlert').on('click',function(e){
		$('#alertbox').hide();
	});

	//EDIT
	if($('input[name=ids]').val()){
		xhqr('/api/user/'+$('input[name=ids]').val(),'GET',{},function(res,ret){
		if(res.status === 'error'){
			$('#alertbox #message').html(res.message);
			$('#alertbox').show();
		}else{
			$('#username').val(res.result.username);
			$('#fullname').val(res.result.fullname);
		}
	});
	}
});

function save(){
	jsData = {
		key : 'abcdh',
		username: $('#username').val(),
		password: $('#password').val(),
		confpassword: $('#confpassword').val(),
		fullname: $('#fullname').val()
	}
	xhqr('/api/user','POST',jsData,function(res,ret){
		if(res.status === 'error'){
			$('#alertbox #message').html(res.message);
			$('#alertbox').show();
		}else{
			document.location.href = '/user'
		}
	});
}

function update(){
	jsData = {
		key : 'abcdh',
		username: $('#username').val(),
		password: $('#password').val(),
		confpassword: $('#confpassword').val(),
		fullname: $('#fullname').val()
	}
	xhqr('/api/user/'+$('input[name=ids]').val(),'PUT',jsData,function(res,ret){
		if(res.status === 'error'){
			$('#alertbox #message').html(res.message);
			$('#alertbox').show();
		}else{
			document.location.href = '/user'
		}
	});
}