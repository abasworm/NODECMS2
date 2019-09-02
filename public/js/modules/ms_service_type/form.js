$(document).ready(function(e){
	//ADD
	$('#alertbox').hide();
	$('#closeAlert').on('click',function(e){
		$('#alertbox').hide();
	});

	//EDIT
	if($('input[name=ids]').val()){
		xhqr('/api/ms_service_type/'+$('input[name=ids]').val(),'GET',{},function(res,ret){
			if(res.status === 'error'){
				$('#alertbox #message').html(res.message);
				$('#alertbox').show();
			}else{
				$('#service_code').val(res.results.service_code);
				$('#service_type').val(res.results.service_type);
				$('#notes').val(res.results.notes);
			}
		});
	}
});

function save(){
	jsData = {
		key : 'abcdh',
		service_code: $('#service_code').val(),
		service_type: $('#service_type').val(),
		notes: $('#notes').val()
	};
	xhqr('/api/ms_service_type','POST',jsData,function(res,ret){
		if(!res.status){
			$('#alertbox #message').html(res.message);
			$('#alertbox').show();
		}else{
			document.location.href = '/ms_service_type'
		}
	});
}

function update(){
	jsData = {
		key : 'abcdh',
		service_code: $('#service_code').val(),
		service_type: $('#service_type').val(),
		notes: $('#notes').val()
	}
	xhqr('/api/ms_service_type/'+$('input[name=ids]').val(),'PUT',jsData,function(res,ret){
		if(!res.status){
			$('#alertbox #message').html(res.message);
			$('#alertbox').show();
		}else{
			document.location.href = '/ms_service_type'
		}
	});
}