var table;
$(document).ready(function() {

    //ADD
	$('#alertbox').hide();
	$('#closeAlert').on('click',function(e){
		$('#alertbox').hide();
	});
    $('.select2').select2();
    $('.datepicker').datepicker({
        autoclose : true,
        format: 'yyyy-mm-dd'
    })
    //datyatable
	var link = "/api/ms_reports/datatable";
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
        "scrollX":true,
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
            dataType: 'JSON',
            contentType:"application/json",
        	url : link,
        	type: "POST",
        	data : function(d){
                d.key = 'abcdh';
                d.date_start = $('#date_start').val();
                d.date_end = $('#date_end').val();
                d.service_type = $('#service_type').val();
                d.service_status = $('#service_status').val();

        	}
        },            
        "columns": [
            
            { "data":null ,"orderable":false, "searchable":false,
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    arrShould = ['OPEN','DRAFT'];
                    $(nTd).html('<div class="btn-group">'
                        +'<a href="javascript:view(\''+oData.id+'\')" class="btn btn-sm bg-blue '+(!arrShould.includes(oData.service_status)?"":"")+'"><i class="fa fa-eye"></i></a> '
                        +'</div>'
                    );
                }
            },
            {"data": "service_ticket"},
            {"data": "service_type"},
            {"data": "serial_number_atm"},
            {"data": "address"},
            {"data": "city"},
            {"data":null ,
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    var x = "";
                    switch(oData.service_status.toUpperCase()){
                        case "ON PROCESS" : x = "<span class='label bg-blue'> ON PROCESS </span>";break;
                        case "OPEN" : x = "<span class='label bg-red'> OPEN </span>";break;
                        case "DRAFT": x = "<span class='label bg-yellow'> DRAFT </span>" ;break;
                        case "CLOSE": x = "<span class='label bg-green'> CLOSE </span>" ;break;
                    }
                $(nTd).html(x);
            }}
                
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

function search(id){
    table.ajax.reload();
}

function view(id){
    document.location = '/ms_reports/view/'+id;
}

