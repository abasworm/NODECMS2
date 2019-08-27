var username;
var password;
$(document).ready(function(e){
    username = $('#username');
    password = $('#password');
    $('#btn_login').on('click', function(e){
        $(this).attr('disabled',true);
        signin();
    });

    $('#alertbox').hide();
    $('#closeAlert').on('click', function(e){
        $('#alertbox').hide();
    });
})

function signin(){
    xhqr('/login/verify', 'POST',{
        key:'abcdh',
        username:username.val(),
        password:password.val()
    },function(res,ret){
        if(!res.status){
            $('#alertbox #message').html(res.message);
            $('#alertbox').show();
            $('#btn_login').attr('disabled',false);
        }else{
            window.location = '/dashboard';
        }
        
    })
}