var apiToken;
var myUser;
var regFBID, regFBDP, regFBName, regFBEmail;


function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

//Hide Overlay
function hideLoginOverlay() {
    $('.loginOverlay').fadeOut(500);
}

// Show Alert Message
function showAlert(message) {
    $('.alertMessage').fadeIn(300);
    $('.alertMessage').html(message);
}

// Function for Checking if User is logged in & valid
function checkCookie() {
    if ($.cookie('myUser-token')) {
        myUser = {
            "token": $.cookie('myUser-token'),
            "email": $.cookie('myUser-email'),
            "name": $.cookie('myUser-name'),
            "profile_pic": $.cookie('myUser-dp'),
            "mobile": $.cookie("myUser-phone")
        };
        $(".myAccount").html(myUser.name + "&nbsp;&nbsp;<i class='fa fa-user'></i>");
        $(".loginTrigger").attr("onclick", "gotoDashboard()");
    } else {
        $(".myAccount").html("LOGIN/SIGN-UP");
        $(".loginTrigger").attr("onclick", "loginButtonClick()");
    }
}

function gotoDashboard() {
    window.location = "http://www.homeluxe.in/accounts/"
}

// Function Called After Successful Login
function loginSuccess() {
    // SET COOKIES
    $.cookie('myUser-name', myUser.name, {expires: 3, path: '/'});
    $.cookie('myUser-email', myUser.email, {expires: 3, path: '/'});
    $.cookie('myUser-phone', myUser.mobile, {expires: 3, path: '/'});
    $.cookie('myUser-token', myUser.token, {expires: 3, path: '/'});
    $.cookie('myUser-dp', myUser.profile_pic, {expires: 3, path: '/'});
    $('.alertMessage').hide();
    $('.loginOverlay').hide();
    $(".loginTrigger").attr("onclick", "gotoDashboard()");
}

// Login to HomeLuxe (NOT oAUTH)
function login(username, password) {
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
                    loginSuccess();
                }
                else if (data.message == "Invalid token detected") {
                    $.removeCookie('myUser-token', {path: '/'});
                    deleteAllCookies();
                }
                else {
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

// Submit Registration Form (NOT oAUTH)
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
    } else {
        showAlert('Please fill the form correctly.');
    }
}


// Show Login Form
function showLogin() {
    $(".loginContainer").animate({"height": "440px"}, 500);
    $(".registerPanel").hide();
    setTimeout(function () {
        $(".loginPanel").fadeIn(500);
    }, 200)

    var spacerHeight = $(".loginSpacer").height();

    $(".loginSpacer").animate({"height": spacerHeight + 65}, 500);
}


// Show Registration Form
function userRegister() {
    $(".loginContainer").animate({"height": "570px"}, 500);
    $(".loginPanel").hide();
    setTimeout(function () {
        $(".registerPanel").fadeIn(500);
    }, 200)


    var spacerHeight = $(".loginSpacer").height();

    $(".loginSpacer").animate({"height": spacerHeight - 65}, 500);
}


// GET HomeLuxe API Token for making requests
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

// INITIALIZE Facebook App Access
window.fbAsyncInit = function () {
    FB.init({
        appId: '607233152758333',
        cookie: true,  // enable cookies to allow the server to access the session
        xfbml: true,  // parse social plugins on this page
        version: 'v2.6' // use graph api version 2.5
    });
};

function facebookRegister() {
    $.ajax({
        type: "POST",
        dataType: "json",
        data: {
            "token": apiToken,
            "name": regFBName,
            "email": regFBEmail,
            "password": regFBID,
            "oauth": regFBID,
            "profile_pic": regFBDP
        },
        url: "http://homeluxe.in:3000/member/register",
        success: function (data) {
            console.log(data);
            login(regFBEmail, regFBID);
        },
        error: function (data) {
            showAlert("An unknown error occurred.");
        }
    });
}

// Login to HomeLuxe (oAuth - FACEBOOK)
function facebookLogin() {

    FB.login(function (response) {
        console.log(response);
        if (response.authResponse) {
            showAlert("Please wait... &nbsp; <i class='fa fa-circle-o-notch fa-spin'></i>");

            FB.api('/me/picture?type=normal', function (response) {
                regFBDP = response.data.url;
                console.log(response.data.url);
            });

            FB.api('/me?fields=name,picture,email,id,link', function (response) {

                regFBName = response.name;
                regFBEmail = response.email;
                regFBID = response.id;

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
                            loginSuccess();
                        } else {
                            facebookRegister();
                        }
                    },
                    error: function (data) {
                        showAlert("An unknown error occurred.");
                    }
                });
            });


        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, {
        scope: 'email,public_profile',
        return_scopes: true
    });
}

// Load Facebook SDK
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

$(document).ready(function () {

    getToken();
    checkCookie();

    setInterval(function () {
        checkCookie();
    }, 3000);

    $(".loginButton").click(function () {
        $(".loginOverlay").fadeIn(500);
    });

    $(".loginOverlay").load("loginOverlay.html");

});
