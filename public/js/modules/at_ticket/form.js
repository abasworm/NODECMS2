$(document).ready(function(e){
	//ADD
	$('#alertbox').hide();
	$('#closeAlert').on('click',function(e){
		$('#alertbox').hide();
	});

	//FORM
	//Select Data Type
	jsData = {
		key : 'abcdh'
	}

	//EDIT
	if($('input[name=ids]').val()){
		xhqr('/api/users/'+$('input[name=ids]').val(),'GET',{},function(res,ret){
		if(res.status === 'error'){
			$('#alertbox #message').html(res.message);
			$('#alertbox').show();
		}else{
			$('#username').val(res.results.username);
			$('#firstname').val(res.results.firstname);
			$('#lastname').val(res.results.lastname);
		}
	});
	}
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

function update(){
	var jsData = {
		key : 'abcdh',
		username: $('#username').val(),
		password: $('#password').val(),
		confpassword: $('#confpassword').val(),
		firstname: $('#firstname').val(),
		lastname: $('#lastname').val()
	}
	xhqr('/api/users/'+$('input[name=ids]').val(),'PUT',jsData,function(res,ret){
		if(!res.status){
			$('#alertbox #message').html(res.message);
			$('#alertbox').show();
		}else{
			document.location.href = '/users';
		}
	});
}

function check_ssbid(){
	// var ssbid = $('#id_atm').val();
	// xhqr('/api/atm/ssbid/'+ssbid,'GET',jsData,function(res,ret){
	// 	if(!res.status){
	// 		$('#alertbox #message').html(res.message);
	// 		$('#alertbox').show();
	// 	}else{
	// 		$('#atm_location').val(res.results[0].location_name);
	// 	}
	// });
}

//TABLE 
//=================================================================

var table;
$(document).ready(function() {
    
    //ADD
	$('#alertbox').hide();
	$('#closeAlert').on('click',function(e){
		$('#alertbox').hide();
	});

    //datyatable
	var link = "/api/at_ticket/datatable/detail";
	//membuat footer menjadi field input
    $('#dt_table tfoot th').each(function () {
        var title = $('#dt_table thead th').eq($(this).index()).text();
        if (title !== 'Aksi'){
            $(this).html('<input type="text" placeholder="Search ' + title + '" />');
        }
    });
    $.extend( $.fn.dataTable.defaults, {
        searching: true,
        paginate: true,
        autoWidth: false,
        columnDefs: [{ 
            orderable: false,
            targets: [ 0 ]
        }],
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        language: {
            search: '<span>Search:</span> _INPUT_',
            lengthMenu: '<span>Show:</span> _MENU_',
            paginate: { 'first': 'First', 'last': 'Last', 'next': '&rarr;', 'previous': '&larr;' }
        }
    });
        

    //mendeklarasikan dan mendefinisikan data table
    table = $('#dt_table').DataTable({
        "processing": true,
        dom: "<'row'<'col-sm-4'B><'col-sm-4'l><'col-sm-4'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-3'i><'col-sm-9'p>>",
        destroy: true,
        stateSave: false,
        deferRender: true,
        processing: true,
        buttons: [
            {
                extend: 'copy',
                text: '<i class="fa fa-copy"></i> Copy',
                titleAttr: 'Copy',
//                    exportOptions: { columns: ':visible:not(:last-child)' }, //last column has the action types detail/edit/delete
                exportOptions: {
                    columns: ':visible:not(:last-child)',
                    modifier: {
                        page: 'current'
                    }
                },
                footer:false
            }, 
            {
                extend: 'excel',
                text: '<i class="fa fa-file-excel"></i> Excel',
                titleAttr: 'Excel',
//                    exportOptions: { columns: ':visible:not(:last-child)' }, //last column has the action types detail/edit/delete
                exportOptions: {
                    columns: ':visible:not(:first-child)',
                    modifier: {
                        page: 'current'
                    }
                },
                footer:false
            },
            {
                extend: 'pdf',
                text: '<i class="fa fa-document"></i> PDF',
                titleAttr: 'PDF',
//                    exportOptions: { columns: ':visible:not(:last-child)' }, //last column has the action types detail/edit/delete
                exportOptions: {
                    columns: ':visible:not(:first-child)',
                    modifier: {
                        page: 'current'
                    }
                },
                footer:false
            }, 
            {
                extend: 'excel',
                text: '<i class="fa fa-file-excel"></i> Excel All Page',
                titleAttr: 'Excel All Page',
                exportOptions: {
                    columns: ':visible:not(:first-child)'
                },
                footer:false
            }
        ],
        "ajax": {
        	headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            complete : function(){
                $('.datepicker').datepicker({
                    autoclose: true
                });
            },
            dataType: 'JSON',
            contentType:"application/json",
        	url : link,
        	type: "POST",
        	data : function(d){
                d.key = 'abcdh';
                d.serial_number_list = $('#atm_serial_number').val();
        	}
        },            
        "columns": [
            
            { "data":null ,"orderable":false, "searchable":false,
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html('<div class="input-group date">\
                            <div class="input-group-addon">\
                                <i class="fa fa-calendar"></i>\
                            </div>\
                            <input type="text" name="input_plan['+ oData.serial_number +']" class="datepicker form-control pull-right">\
                        </div>'
                    );
                }
            },
            { "data":null ,"orderable":false, "searchable":false,
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html('<div class="input-group date">\
                            <div class="input-group-addon">\
                                <i class="fa fa-calendar"></i>\
                            </div>\
                            <input type="text" name="input_actual['+ oData.serial_number +']" data-sn="'+ oData.serial_number +'" class="datepicker form-control pull-right">\
                        </div>'
                    );
                }
            },
            {"data": "serial_number"},
            { "data":null ,"orderable":false, "searchable":false,
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html('<div class="input-group">\
                            <textarea rows="5" cols="30" name="input_actual['+ oData.serial_number +']" class="form-control" disabled>'+ oData.location_name +', ' + oData.city +'</textarea>\
                        </div>'
                    );
                }
            },

                
        ],

        order: [[ 0, "desc" ]],
        columnDefs: [{ 
            orderable: false,
            targets: [ 0 ]
        }],
    });

    //untuk menambahkan fungsi pada setiap button yang ada
    $('#dt_table tbody').on('click', 'a', function () {
        var data = table.row($(this).parents('tr')).data();
            //            alert( data[id] +"'ID : "+ data[id] );
        console.log($(this).parents('tr'));
    });

    //membuat fungsi untuk search pada setiap kolom input yang tersedia
    table.columns().every(function () {
        var that = this;
        $('input', this.footer()).on('keyup change', function () {
            if (that.search() !== this.value) {
                that
                .search(this.value)
                .draw();
            }
        });
    });
});

function search(){
    table.ajax.reload();
}