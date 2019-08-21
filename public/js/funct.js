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
        error: function error_xhqr(jqXHR, textStatus, errorThrown){
            // Handle errors here
            console.log('ERRORS: ' + textStatus + ' - ' + errorThrown );          
        }
    });
}

function error_xhqr(jqXHR, textStatus, errorThrown){
    // Handle errors here
    console.log('ERRORS: ' + textStatus + ' - ' + errorThrown );          
}

////////////////////////////////////////////////////////////////////////////////