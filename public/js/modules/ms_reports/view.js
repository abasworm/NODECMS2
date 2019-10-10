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
	//FORM
	//Select Data Type
	jsData = {
		key : 'abcdh'
	}
	

	//EDIT
	if($('input[name=ids]').val()){
		xhqr('/api/ms_aproval/'+$('input[name=ids]').val(),'GET',{},function(res,ret){
		if(res.status === 'error'){
			$('#alertbox #message').html(res.message);
			$('#alertbox').show();
		}else{
            $('#no_ticket').val(res.results.service_ticket);
			$('#id_atm').val(res.results.serial_number_atm);
			$('#service_code').val(res.results.service_code);
			//$('#service_code').select2('refresh');
			$('#service_image_before').attr('src',res.results.service_image_path.substring(1));
			$('#service_image_after').attr('src',res.results.service_image_path_closed.substring(1));
            // tinyMCE.activeEditor.insertContent(res.results.service_notes);
			$('#service_notes_before').html(res.results.service_notes);
			

			check_ssbid();
			check_history();
		}
	});
	}
});

function check_history(){
	var noTicket = $('#no_ticket').val();
	xhqr('/api/ms_aproval/history','POST',{
		no_ticket : noTicket
	},
	function(res,ret){
		if(res.status === 'error'){
			$('#alertbox #message').html(res.message);
			$('#alertbox').show();
		}else{
			var timeline = "";
			var iconB = '<i class="fa fa-envelope bg-blue">';
			for(var data in res.results){
				switch(res.results[data].service_status){
					case 'ON PROCESS' : iconB = '<i class="fa fa-user-plus bg-yellow">';break;
					case 'OPEN' : iconB = '<i class="fa fa-folder-open bg-red">';break;
					case 'DRAFT' : iconB = '<i class="fa fa-gears bg-blue">';break;
					case 'CLOSE' : iconB = '<i class="fa fa-thumbs-up bg-green">';break;
				}
				timeline += '<li> '+iconB+'</i><div class="timeline-item"><span class="time"><i class="fa fa-clock-o"></i> '+res.results[data].created_date.replace(/T|Z/g," ")+'</span>	<h3 class="timeline-header">'+ res.results[data].created_by +' ( '+res.results[data].service_status+' )</h3>	<div class="timeline-body"> '+ res.results[data].service_notes +' </div>	<div class="timeline-footer">	</div></div></li>';
			}
			$('#timeliner').html(timeline);
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

