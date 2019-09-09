////////////////////////////////////////////////////////////////////////////////
//                              AJAX Function
////////////////////////////////////////////////////////////////////////////////
function xhqr(url, type, data, successT, errorT){
    $.ajax({
        type: type,
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'auth_token' : $('#keyAt').val()
        },
        dataType: 'JSON',
        contentType:"application/json",
        data: data,
        success: successT,
        error: error_xhqr
    });
}

function xhrf(xurl,xcomplete,xdata,xmethod='POST'){
    var form_data = new FormData();
    var s = xdata;

    $.each(s, function(i,a){
        form_data.append(i, a);
    });

    form_data.append('key','abcdh');
    form_data.append('image',$('#imgs').attr('src'),"images");
    $.ajax({
        url: xurl,
        cache : false,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'auth_token' : $('#keyAt').val()
        },
        dataType: 'JSON',
        contentType:false,
        processData:false,
        data: form_data,
        complete: xcomplete,
        method:xmethod,
        error: error_xhqr
    });
}

function error_xhqr(jqXHR, textStatus, errorThrown){
    // Handle errors here
    console.log('ERRORS: ' + textStatus + ' - ' + errorThrown );          
}

////////////////////////////////////////////////////////////////////////////////