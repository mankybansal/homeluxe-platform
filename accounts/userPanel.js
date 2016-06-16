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
                if (data.status == "Success") {
                    myUser = data;
                    showDashboard();
                } else {
                    showAlert('Wrong username or password.');
                }
            },
            error: function (data) {
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
}


var apiToken;

var myUser;


$(document).ready(function () {

    $(".signOutButton").click(function(){
        $.removeCookie('myUser-token', { path: '/' });
        hideDashboard();
    });
    
    if ($.cookie('myUser-token')) {

        showAlert("Signing in as <b>"+$.cookie('myUser-name')+"</b> &nbsp; <i class='fa fa-circle-o-notch fa-spin'></i>");
        
        myUser = {
            "token": $.cookie('myUser-token'),
            "email": $.cookie('myUser-email'),
            "name": $.cookie('myUser-name'),
            "profile_pic": $.cookie('myUser-dp'),
            "mobile": $.cookie("myUser-phone")
        };
        
        setTimeout(showDashboard(),3000);
    }
    


    $(".loginButton").click(function () {
        var username = $('#username').val();
        var password = $('#password').val();
        showAlert("Please wait... &nbsp; <i class='fa fa-circle-o-notch fa-spin'></i>");
        login(username, password);
    });

    $(".menuOption").click(function () {
        var menuGroupSelected = $(this).parent().find('.menuGroupLabel').text();
        var menuOptionSelected = $(this).find('.menuOptionText').text();

        $('.menuGroupSelected').html(menuGroupSelected);
        $('.menuOptionSelected').html(menuOptionSelected);

        $(".menuLeft").find(".optionSelected").removeClass("optionSelected");
        $(this).addClass("optionSelected");

    })


    getToken();

});

function isTokenSet() {
    if (apiToken) {
        return true;
    } else {
        return false;
    }
}

function submitRegister() {
    var rname = $('#regName').val();
    var remail = $('#regEmail').val();
    var rphone = $('#regPhone').val();
    var rpassword = $('#regPassword').val();

    if (rname != "" && remail != "" && rpassword != "" && rphone != "") {
        $.ajax({
            type: "POST",
            dataType: "json",
            data: {
                "token": apiToken,
                "name": rname,
                "email": remail,
                "mobile": rphone,
                "password": rpassword
            },
            url: "http://homeluxe.in:3000/member/register",
            success: function (data) {
                if (data.status == "Success") {
                    showLogin();
                    showAlert('Account Created. Please Sign-in.');
                } else if (data.status == "Failed" && data.message == "User already exists") {
                    showAlert('You already have an account.');
                }
                else {
                    showAlert('Please fill the form correctly.');
                }
            },
            error: function (data) {
                showAlert("An unknown error occurred.");
            }
        });
    }
}

function showLogin() {
    $(".loginContainer").animate({"height": "440px"}, 500);
    $(".registerPanel").hide();
    setTimeout(function () {
        $(".loginPanel").fadeIn(500);
    }, 200)

    var spacerHeight = $(".loginSpacer").height();

    $(".loginSpacer").animate({"height": spacerHeight + 65}, 500);
}

function facebookRegister() {

}

function userRegister() {
    $(".loginContainer").animate({"height": "570px"}, 500);
    $(".loginPanel").hide();
    setTimeout(function () {
        $(".registerPanel").fadeIn(500);
    }, 200)


    var spacerHeight = $(".loginSpacer").height();

    $(".loginSpacer").animate({"height": spacerHeight - 65}, 500);
}

function showDashboard() {

    $.cookie('myUser-name', myUser.name, {expires: 3, path: '/'});
    $.cookie('myUser-email', myUser.email, {expires: 3, path: '/'});
    $.cookie('myUser-phone', myUser.phone, {expires: 3, path: '/'});
    $.cookie('myUser-token', myUser.token, {expires: 3, path: '/'});
    $.cookie('myUser-dp', myUser.profile_pic, {expires: 3, path: '/'});

    setTimeout(function () {
        $('.loginOverlay').fadeOut(1000);
    }, 2000);

    setTimeout(function () {
        $('.contentOverlay').fadeIn(1000);
    }, 3000);

    $(".dataName").html(myUser.name);
    if (myUser.profile_pic) {
        $(".avatarBox").append("<img class='profilePic' src='" + myUser.profile_pic + "'/>");
    } else {
        $(".avatarBox").append("<i class='fa fa-user' style='font-size: 25px; margin-top: 7.5px; margin-left: 10px; color: rgba(0,0,0,0.2);'></i>");
    }
}

function hideDashboard() {

   
    setTimeout(function () {
        $('.contentOverlay').fadeOut(1000);
    }, 2000);

    setTimeout(function () {
        $('.loginOverlay').fadeIn(1000);
        showAlert("Successfully logged out.");
    }, 3000);
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


    showAlert("Please wait... &nbsp; <i class='fa fa-circle-o-notch fa-spin'></i>");

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
                if (data.status == "Success") {
                    myUser = data;
                    showDashboard();
                } else {
                    showAlert('Wrong username or password.');
                }
            },
            error: function (data) {
                showAlert("An unknown error occurred.");
            }
        });
    });

    FB.api('/me/picture?type=normal', function (response) {
        console.log(response.data.url);
    });
}


var regFBID, regFBDP;

function facebookRegister() {
    FB.login(function (response) {
        console.log(response);
        if (response.authResponse) {


            FB.api('/me?fields=name,picture,email,id,link', function (response) {
                console.log(response.name);
                console.log(response.id);
                console.log(response.email);

                regFBID = response.id;

                $('#regName').css({"background": "#3b5998", "color": "white"}).val(response.name);
                $('#regEmail').css({
                    "background": "#3b5998",
                    "color": "white"
                }).val(response.email).attr("disabled", "disabled");
                $('#regPhone').val();
                $('#regPassword').css({
                    "background": "#3b5998",
                    "color": "white"
                }).val(response.id).attr("disabled", "disabled");
                showAlert("Verify Information From Facebook");
            });

            $(".fbRegisterButton").hide();
            $(".regStep2").hide();
            $(".fbContButton").show();

            FB.api('/me/picture?type=normal', function (response) {
                regFBDP = response.data.url;
            });

        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, {
        scope: 'email,public_profile',
        return_scopes: true
    });
}


function fbsubmitRegister() {


    var rname = $('#regName').val();
    var remail = $('#regEmail').val();
    var rphone = $('#regPhone').val();
    var rpassword = $('#regPassword').val();


    if (rname != "" && rphone != "") {
        $.ajax({
            type: "POST",
            dataType: "json",
            data: {
                "token": apiToken,
                "name": rname,
                "email": remail,
                "mobile": rphone,
                "password": rpassword,
                "oauth": regFBID,
                "profile_pic": regFBDP
            },
            url: "http://homeluxe.in:3000/member/register",
            success: function (data) {
                console.log(data);
                if (data.status == "Success") {
                    showLogin();
                    showAlert('Account Created. Please Sign-in.');
                } else if (data.status == "Failed" && data.message == "User already exists") {
                    showAlert('You already have an account.');
                }
                else {
                    showAlert('Please fill the form correctly.');
                }
            },
            error: function (data) {
                showAlert("An unknown error occurred.");
            }
        });
    } else {
        showAlert('Please fill the form correctly.');
    }
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
