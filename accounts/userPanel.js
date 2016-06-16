/**
 * Created by mayankbansal on 6/14/16.
 */


function login(username, password) {

    console.log(username, password);

    if (username != "" && password != "") {
        $.ajax({
            type: "POST",
            dataType: "json",
            data: {
                "token": apiToken,
                "email": username,
                "password": password
            },
            url: "http://homeluxe.in:3000/member/login",
            success: function (data) {
                if(data.status == "Success"){
                    myUser = data;
                    showDashboard();
                }else{
                    showAlert('Wrong username or password.');
                }
            },
            error: function(data){
                showAlert("An unknown error occurred.");
            }
        });
    } else {
        showAlert('Please enter a username & password.');
    }
}

function showAlert(message) {
    $('.alertMessage').fadeIn(300);
    $('.alertMessage').html(message);
    $('.loginLoader').hide();
}


var apiToken;

var myUser;


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


    getToken();

});

function isTokenSet(){
    if(apiToken){
        return true;
    }else {
        return false;
    }
}


function submitRegister(){

}

function facebookRegister(){
    
}

function userRegister(){
    $(".loginContainer").animate({"height":"570px"},500);
    $(".loginPanel").hide();
    setTimeout(function(){
        $(".registerPanel").fadeIn(500);
    },200)
    
    
    var spacerHeight = $(".loginSpacer").height();
    
    $(".loginSpacer").animate({"height":spacerHeight-65},500);
}

function showDashboard(){
    setTimeout(function () {
        $('.loginOverlay').fadeOut(1000);
    }, 2000);

    setTimeout(function () {
        $('.contentOverlay').fadeIn(1000);
    }, 3000);
    
    $(".dataName").html(myUser.name);
    $(".avatarBox").append("<img class='profilePic' src='" + myUser.profile_pic + "'/>");
}

function getToken() {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "http://homeluxe.in:3000/getToken",
        success: function (data) {

            if (data.success == true) {
                apiToken = data.token;
                console.log(apiToken);

            } else {
                console.log("ERROR RECEIVING TOKEN");
            }

        }
    });
}

window.fbAsyncInit = function () {
    FB.init({
        appId: '607233152758333',
        cookie: true,  // enable cookies to allow the server to access the session
        xfbml: true,  // parse social plugins on this page
        version: 'v2.6' // use graph api version 2.5
    });
};

function FBLogin() {

    FB.login(function (response) {
        console.log(response);
        if (response.authResponse) {
            getUserInfo();
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, {
        scope: 'email,public_profile',
        return_scopes: true
    });
}

function getUserInfo() {
    FB.api('/me?fields=name,picture,email,id,link', function (response) {
        console.log(response.name);
        console.log(response.id);
        console.log(response.email);

        $.ajax({
            type: "POST",
            dataType: "json",
            data: {
                "token": apiToken,
                "email": response.email,
                "oauth": response.id
            },
            url: "http://homeluxe.in:3000/member/login",
            success: function (data) {
                if(data.status == "Success"){
                    myUser = data;
                    showDashboard();
                }else{
                    showAlert('Wrong username or password.');
                }
            },
            error: function(data){
                showAlert("An unknown error occurred.");
            }
        });
    });

    FB.api('/me/picture?type=normal', function (response) {
        console.log(response.data.url);
    });
}

// Load the SDK asynchronously
(function (d) {
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));
