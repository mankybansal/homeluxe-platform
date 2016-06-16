/**
 * Created by mayankbansal on 6/14/16.
 */


function login(username, password) {



    console.log(username, password);

    var loginSuccess = true;
    var connectionError = false;

    if (username != "" && password != "") {
        //CHECK LOGIN HERE
        if (!connectionError) {
            if (loginSuccess) {
                setTimeout(function () {
                    $('.loginOverlay').fadeOut(1000);
                }, 2000);

                setTimeout(function () {
                    $('.contentOverlay').fadeIn(1000);
                }, 3000);
            } else {
                showAlert('Access denied.');
            }
        } else {
            showAlert('An unknown error occurred.');
        }
    } else {
        showAlert('Please enter a username & password.');
    }
}

function showAlert(message) {
    $('.alertMessage').fadeIn(300);
    $('.alertMessage').html(message);
    $('.loginLoader').hide();
}

$(document).ready(function () {


    $(".loginButton").click(function () {
        var username = $('#username').val();
        var password = $('#password').val();
        $('.loginLoader').show();
        login(username, password);
    });

    $(".menuOption").click(function(){
        var menuGroupSelected = $(this).parent().find('.menuGroupLabel').text();
        var menuOptionSelected = $(this).find('.menuOptionText').text();

        $('.menuGroupSelected').html(menuGroupSelected);
        $('.menuOptionSelected').html(menuOptionSelected);

        $(".menuLeft").find(".optionSelected").removeClass("optionSelected");
        $(this).addClass("optionSelected");

    })


});