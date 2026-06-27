function onsubscribe() {
    var email_id = $('#email_id').val();
    if (email_id) {
        if(!ValidateEmail(email_id)){
            alert('You have entered an invalid email address!');
            return false;
        }
    }else{
        alert('Please enter your email id!');
        return false;
    }
    $('#subcribeBtn').hide();
    $('#subcribeLoader').show();
    $.ajax({
        type: 'get',
        data: {
            email: email_id
        },
        url: "/subscribe",
        success: function (response) {
            console.log(response);
            $('#subscribeSuccess').html(response);
            $('#subcribeLoader').hide();
            $('#subcribeBtn').show();
            $('#subscribeSuccess').show();
            setTimeout(() => {
                $('#subscribeSuccess').hide();
            }, 5000)
        }
    }).fail(function (error) {
        console.log(error);
        var server_error = error.responseJSON.errors;
        var server_error_array = [];
        for (var x in server_error) {
            server_error_array.push(server_error[x]);
        }
        var serverside_error = server_error_array[0][0];
        $('#subscribeFail').html(serverside_error);
        $('#subscribeFail').show();
        $('#subcribeLoader').hide();
        $('#subcribeBtn').show();
        setTimeout(() => {
            $('#subscribeFail').hide();
        }, 5000);
    });
}


// this function is used for validate email
function ValidateEmail(mail){
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){
        return (true)
    }
    return (false);
}

// Mobile nav offcanvas
$(document).ready(function() {
    var subnav = "#nav_sub";
    $('.sub-nav').on('click', function(e) {
        e.preventDefault();
        const dtitle = $('.sub-content', this).data('title');
        const ddesc = $('.sub-content', this).data('desc');
        const dcontent = $('.sub-content', this).clone();
        $(subnav + " .offcanvas-title").html(dtitle);
        $(subnav + " .intro").html(ddesc);
        $(subnav + " .sub-menu-content").html(dcontent);
        $("#nav_sub").offcanvas('show');
    });
    $("#offcanvasRight .btn-close").on('click', function() {
        $("#nav_sub").offcanvas('hide');
        $("#offcanvasRight").offcanvas('hide');
    })
    // LISTEN FOR SUB NAV BACK BUTTON AND RESET THE OFF CANVAS CONTENT
    $("#nav_sub .btn-close").on('click', function() {
        const subnav = $(this).data('bs-dismiss');
        $("#" + subnav).offcanvas('hide');
        $("#" + subnav + " .offcanvas-title").html('');
        $("#" + subnav + " .intro").html('');
        $("#" + subnav + " .sub-menu-content").html('');
    })
});
