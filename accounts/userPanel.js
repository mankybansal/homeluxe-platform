/**
 * Created by mayankbansal on 6/14/16.
 */

function deleteAllCookies(name) {
    // This function will attempt to remove a cookie from all paths.
    var pathBits = location.pathname.split('/');
    var pathCurrent = ' path=';

    // do a simple pathless delete first.
    document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;';

    for (var i = 0; i < pathBits.length; i++) {
        pathCurrent += ((pathCurrent.substr(-1) != '/') ? '/' : '') + pathBits[i];
        document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;' + pathCurrent + ';';
    }
}


var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};


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

var myLikes;

function getLikes(){
    $.ajax({
        type: "POST",
        dataType: "json",
        data: {
            "token": myUser.token,
        },
        url: "http://homeluxe.in:3000/member/likes",
        success: function (data) {
            if(data.success != "false"){
                myLikes = data;
                updateLikes();
            }
        },
        error: function (data) {
            console.log("An unknown error occurred.");
        }
    });
}

function updateLikes(){
    $(".dataLikeCount").html(myLikes.length);

    $("#viewMyLikes").empty();
    if(myLikes.length > 0){
        $.each(myLikes, function(index,item){
            if(item.catalogueKey){
                $("#viewMyLikes").append("<div id='"+item.catalogueKey+"' class='likeBox'><div class='likeBoxImageBox'><img src='../images/styles/covers/clear-images/"+item.cover_pic+"' class='likeBoxImage'></div><div class='likeBoxStyleTitle'>"+item.name+"</div><div class='likeBoxDescription'>"+item.description+"</div><div class='likeBoxPrice'><i class='fa fa-rupee'></i>&nbsp;"+item.price+"</div></div>");
                //$("#viewMyLikes").append("<div id='"+item.catalogueKey+"' class='likeBox'><div class='likeBoxImageBox'><img src='../images/NOIMAGE.png' class='likeBoxImage'></div><div class='likeBoxStyleTitle'>"+item.name+"</div><div class='likeBoxDescription'>"+item.description+"</div><div class='likeBoxPrice'><i class='fa fa-rupee'></i>&nbsp;"+item.price+"</div></div>");
            }else{
                $("#viewMyLikes").append("<div class='likeBoxRoom'><div class='likeBoxImageBox'><img src='../images/NOIMAGE.png' class='likeBoxImage'></div><div class='likeBoxStyleTitle'>"+item.name+"</div><div class='likeBoxDescription'>"+item.desc+"</div></div>");

            }
            
        });
    }

}

var nodeID;

$(document).ready(function () {

    $(".signOutButton").click(function(){
        $.removeCookie('myUser-token', { path: '/' });
        deleteAllCookies('myUser-token');
        hideDashboard();
    });


    nodeID = getUrlParameter("nodeID");
    

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
        var menuGroupSelected = $(this).parent().find(".menuGroupLabel").text();
        var menuOptionSelected = $(this).find(".menuOptionText").text();

        $('.menuGroupSelected').html(menuGroupSelected);
        $('.menuOptionSelected').html(menuOptionSelected);

        $(".menuLeft").find(".optionSelected").removeClass("optionSelected");
        $(this).addClass("optionSelected");
        
        $(".viewPanel").hide();
        
        $("#"+ $(this).find(".menuOptionSelect").attr('class').split(' ')[1]).fadeIn(500);
    });


    getToken();

});

function viewLikes(){
    $(".viewPanel").hide();
    $(".menuLeft").find(".optionSelected").removeClass("optionSelected");
    $(".menuLeft").find(".viewMyLikes").parent().addClass("optionSelected");
    $("#viewMyLikes").fadeIn(500);
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


function userRegister() {
    $(".loginContainer").animate({"height": "570px"}, 500);
    $(".loginPanel").hide();
    setTimeout(function () {
        $(".registerPanel").fadeIn(500);
    }, 200)


    var spacerHeight = $(".loginSpacer").height();

    $(".loginSpacer").animate({"height": spacerHeight - 65}, 500);
}

var fbConnected = false;

function showDashboard() {

    $.cookie('myUser-name', myUser.name, {expires: 3, path: '/'});
    $.cookie('myUser-email', myUser.email, {expires: 3, path: '/'});
    $.cookie('myUser-phone', myUser.mobile, {expires: 3, path: '/'});
    $.cookie('myUser-token', myUser.token, {expires: 3, path: '/'});
    $.cookie('myUser-dp', myUser.profile_pic, {expires: 3, path: '/'});

    
    $(".viewPanel").hide();
    $(".menuLeft").find(".optionSelected").removeClass("optionSelected");
    $(".menuLeft").find(".viewOverview").parent().addClass("optionSelected");
    $("#viewOverview").fadeIn(500);
    
    getLikes();
    
    setTimeout(function () {
        $('.loginOverlay').fadeOut(1000);
    }, 2000);

    setTimeout(function () {
        $('.contentOverlay').fadeIn(1000);
    }, 3000);

    $(".dataName").html(myUser.name);
    if (myUser.profile_pic) {
        $(".avatarBox").empty().append("<img class='profilePic' src='" + myUser.profile_pic + "'/>");
    } else {
        $(".avatarBox").empty().append("<i class='fa fa-user' style='font-size: 25px; margin-top: 7.5px; margin-left: 10px; color: rgba(0,0,0,0.2);'></i>");
    }
    
    $(".myDP").append("<img src='"+myUser.profile_pic+"' class='myDPimage'>");
    $(".myName").html(myUser.name);
    $(".myEmail").html(myUser.email);
    $(".myPhone").html(myUser.mobile);
    
    if(fbConnected){
        $(".connectedTo").html("Connected to Facebook");
    }else{
        $(".connectedTo").html("Not Connected"); 
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
    
    fbConnected = true;

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
