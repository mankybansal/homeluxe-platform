var myUser;
var regFBID, regFBDP, regFBName, regFBEmail;

//Hide Overlay
function hideLoginOverlay() {
    $('.loginOverlay').fadeOut(500);
}

// Show Alert Message
function showAlert(message) {
    $(".alertMessage").fadeIn(300).html(message);
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
        requests.userLogin(username, password, function (response) {
            if (response.status == "Success") {
                myUser = response;
                loginSuccess();
            }
            else showAlert('Wrong username or password.');
        });
    }
    else showAlert('Please enter a username & password.');
}

// Submit Registration Form (NOT oAUTH)
function submitRegister() {
    var rname = $('#regName').val();
    var remail = $('#regEmail').val();
    var rphone = $('#regPhone').val();
    var rpassword = $('#regPassword').val();

    if (rname != "" && remail != "" && rpassword != "" && rphone != "") {
        requests.userRegiserForm(rname, remail, rphone, rpassword, function (response) {
            if (response.status == "Success")
                login(remail, rpassword);
            else if (response.status == "Failed" && response.message == "User already exists")
                showAlert('You already have an account.');
            else showAlert('Please fill the form correctly.');
        });
    } else showAlert('Please fill the form correctly.');
}


// Show Login Form
function showLogin() {
    $(".loginContainer").animate({"height": "440px"}, 500);
    $(".registerPanel").hide();
    setTimeout(function () {
        $(".loginPanel").fadeIn(500);
    }, 200);
    var spacerHeight = $(".loginSpacer").height();
    $(".loginSpacer").animate({"height": spacerHeight + 65}, 500);
}


// Show Registration Form
function userRegister() {
    $(".loginContainer").animate({"height": "570px"}, 500);
    $(".loginPanel").hide();
    setTimeout(function () {
        $(".registerPanel").fadeIn(500);
    }, 200);
    var spacerHeight = $(".loginSpacer").height();
    $(".loginSpacer").animate({"height": spacerHeight - 65}, 500);
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
    requests.userRegisterFacebook(regFBName, regFBEmail, regFBID, regFBDP, function () {
        console.log(data);
        login(regFBEmail, regFBID);
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

                console.log(response);

                requests.userLogin(response.email, response.id, function (response) {
                    if (response.status == "Success") {
                        myUser = response;
                        loginSuccess();
                    }
                    else facebookRegister();
                });
            });
        }
        else console.log('User cancelled login or did not fully authorize.');
    }, {scope: 'email,public_profile'});
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
    checkCookie();
    setInterval(function () {
        checkCookie();
    }, 3000);

    $(".loginButton").click(function () {
        $(".loginOverlay").fadeIn(500);
    });

    $(".loginOverlay").load("loginOverlay.html");
});
