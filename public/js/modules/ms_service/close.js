$(document).ready(function(e){
	//ADD
	$('#alertbox').hide();
	$('#closeAlert').on('click',function(e){
		$('#alertbox').hide();
	});

	//tinymce
	tinyMCE.init({
		selector: '#service_notes'
	});

	//initVideo
	initVideo();
	//FORM
	//Select Data Type
	jsData = {
		key : 'abcdh'
	}
	xhqr('/api/ms_service/service_type','GET',jsData,function(res,ret){
		if(!res.status){
			$('#alertbox #message').html(res.message);
			$('#alertbox').show();
		}else{
			var x=[];
			var data = res.results;
			for(var i in data){
				x.push({
					"id" : data[i].service_code,
					"text" : data[i].service_type
				});
			}
			console.table(x);
			//$('#service_code').select2({data:x});
		}
	});

	//EDIT
	if($('input[name=ids]').val()){
		xhqr('/api/ms_service/'+$('input[name=ids]').val(),'GET',{},function(res,ret){
		if(res.status === 'error'){
			$('#alertbox #message').html(res.message);
			$('#alertbox').show();
		}else{
            $('#no_ticket').val(res.results.service_ticket);
			$('#id_atm').val(res.results.serial_number_atm);
			$('#service_code').val(res.results.service_code);
			//$('#service_code').select2('refresh');
			$('#service_image_before').attr('src',res.results.service_image_path.substring(1));
            // tinyMCE.activeEditor.insertContent(res.results.service_notes);
            $('#service_notes_before').html(res.results.service_notes);
            check_ssbid();
		}
	});
	}
});

function check_ssbid(){
	var ssbid = $('#id_atm').val();
	xhqr('/api/atm/ssbid/'+ssbid,'GET',jsData,function(res,ret){
		if(!res.status){
			$('#alertbox #message').html(res.message);
			$('#alertbox').show();
		}else{
			$('#atm_location').val(res.results[0].location_name);
		}
	});
}

function update(){
	var jsData = {
        key : 'abcdh',
        no_ticket : $('#no_ticket').val(),
		image : $('#imgs').attr('src'),
		service_notes: tinyMCE.get('service_notes').getContent()
	}
	xhqr('/api/ms_service/'+$('input[name=ids]').val(),'PUT',jsData,function(res,ret){
		if(!res.status){
			$('#alertbox #message').html(res.message);
			$('#alertbox').show();
		}else{
			document.location.href = '/ms_service';
		}
	});
}