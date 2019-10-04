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
			$('#service_code').select2({data:x});
		}
	});

	//SELECT 2
	

	
});

function save(){
	var jsData = {
		key : 'abcdh',
		service_code: $('#service_code').val(),
		id_atm: $('#id_atm').val(),
		image : $('#imgs').attr('src'),
		service_notes: tinyMCE.get('service_notes').getContent()		
	}
	xhqr('/api/ms_service','POST',jsData,function(res,ret){
		if(!res.status){
			$('#alertbox #message').html(res.message);
			$('#alertbox').show();
		}else{
			document.location.href = '/ms_service'
		}
	});
}



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

