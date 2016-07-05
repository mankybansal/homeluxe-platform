/**
 * Created by mayankbansal on 6/14/16.
 */

var dashboard = true;
var myLikes;

homeluxeApp.controller("userControl", function ($scope, $rootScope, $interval) {

    $scope.hideLoginOverlay = function () {
        $('.loginOverlay').fadeOut(500);
    };

    $scope.isValid = function (value) {
        return (typeof value != 'undefined' && value != "");
    };

    $scope.login = function () {
        if ($scope.isValid($scope.guest.email) && $scope.isValid($scope.guest.password))
            requests.userLogin($scope.guest.email, $scope.guest.password, function (response) {
                $scope.$apply(function () {
                    if (response.status == "Success") {
                        $scope.ngMyUser = response;
                        $scope.loginSuccess();
                    }
                    else showAlert('Wrong username or password.');
                });
            });
        else showAlert('Please enter a username & password.');
        if (typeof dashboard != 'undefined' && dashboard) showDashboard();
    };

    $scope.submitRegister = function () {
        if ($scope.isValid($scope.guest.name) && $scope.isValid($scope.guest.email) && $scope.isValid($scope.guest.password))
            requests.userRegiserForm($scope.guest.name, $scope.guest.email, $scope.guest.password, function (response) {
                if (response.status == "Success")
                    $scope.login();
                else if (response.status == "Failed" && response.message == "User already exists")
                    showAlert('You already have an account.');
                else showAlert('Please fill the form correctly.');
            });
        else showAlert('Please fill the form correctly.');
    };

    $scope.showLogin = function () {
        $(".loginContainer").animate({"height": "520px"}, 500);
        $(".registerPanel").hide();
        setTimeout(function () {
            $(".loginPanel").fadeIn(500);
        }, 200);
        var spacerHeight = $(".loginSpacer").height();
        $(".loginSpacer").animate({"height": spacerHeight + 35}, 500);
    };

    $scope.userRegister = function () {
        $(".loginContainer").animate({"height": "590px"}, 500);
        $(".loginPanel").hide();
        setTimeout(function () {
            $(".registerPanel").fadeIn(500);
        }, 200);
        var spacerHeight = $(".loginSpacer").height();
        $(".loginSpacer").animate({"height": spacerHeight - 35}, 500);
    };

    $scope.facebookRegister = function () {
        requests.userRegisterFacebook($scope.facebook.name, $scope.facebook.email, $scope.facebook.id, $scope.facebook.dp, function (response) {
            console.log(response);
            $scope.facebook.connected = true;
            $scope.login($scope.facebook.email, $scope.facebook.id);
        });
    };

    $scope.facebookLogin = function () {
        FB.login(function (response) {
            console.log(response);
            if (response.authResponse) {
                showAlert("Please wait... &nbsp; <i class='fa fa-circle-o-notch fa-spin'></i>");

                FB.api('/me/picture?type=normal', function (response) {
                    $scope.facebook.dp = response.data.url;
                });

                FB.api('/me?fields=name,picture,email,id,link', function (response) {

                    $scope.facebook.name = response.name;
                    $scope.facebook.id = response.id;
                    $scope.facebook.email = response.email;

                    requests.userLogin(response.email, response.id, function (response) {
                        $scope.$apply(function () {
                            if (response.status == "Success") {
                                $scope.ngMyUser = response;
                                $scope.facebook.connected = true;
                                $scope.loginSuccess();
                            }
                            else facebookRegister();
                        });
                    });
                    console.log($scope.facebook);
                });
            }
            else showAlert('Facebook Login Failed.');
        }, {scope: 'email,public_profile'});
    };

    $scope.checkCookie = function () {
        if (!($scope.ngMyUser = Cookies.getJSON('myUser')))
            $scope.ngMyUser = false;
    };

    $scope.init = function () {
        $scope.checkCookie();
        $scope.accountOptions = false;
        $scope.ngMyUser = false;
        $scope.facebook = {};
        $scope.guest = {};

        $scope.cookieChecker = $interval(function () {
            $scope.checkCookie();
        }, 3000);
    };

    $scope.accountOptionsTrigger = function () {
        if (!$scope.ngMyUser) loginButtonClick();
        else $scope.accountOptions = !$scope.accountOptions;
    };

    $scope.gotoDashboard = function () {
        window.location = baseURL + "accounts/";
    };

    $scope.logout = function () {
        Cookies.remove('myUser');
        $interval.cancel($scope.cookieChecker);
        $scope.init();
    };

    $scope.loginSuccess = function () {
        // SET COOKIES
        if ($scope.facebook.connected) $scope.ngMyUser.fbConnected = $scope.facebook.connected;
        Cookies.set('myUser', $scope.ngMyUser);
        $('.alertMessage').hide();
        $('.loginOverlay').hide();
        if (typeof dashboard != 'undefined' && dashboard) showDashboard();
    };

    $scope.init();
});


function getLikes(){
    requests.getLikes(myUser.token, function(response){
        if(response.success != "false"){
            myLikes = response;
            updateLikes();
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

$(document).ready(function () {

    $('.loginOverlay').fadeIn(500);
    
    $(".signOutButton").click(function(){
        Cookies.remove('myUser');
        hideDashboard();
    });

    if (myUser = Cookies.getJSON('myUser')) {
        showAlert("Signing in as <b>"+myUser.name+"</b> &nbsp; <i class='fa fa-circle-o-notch fa-spin'></i>");
        setTimeout(showDashboard(),3000);
    }

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
});

function showDashboard() {
    
    $(".viewPanel").hide();
    $(".menuLeft")
        .find(".optionSelected").removeClass("optionSelected")
        .find(".viewOverview").parent().addClass("optionSelected");
    $("#viewOverview").fadeIn(500);
    
    getLikes();

    setTimeout(function () {
        $('.loginOverlay').fadeOut(1000);
    }, 2000);

    setTimeout(function () {
        $('.contentOverlay').fadeIn(1000);
    }, 3000);

    $(".dataName").html(myUser.name);
    if (myUser.profile_pic)
        $(".avatarBox").empty().append("<img class='profilePic' src='" + myUser.profile_pic + "'/>");
    else
        $(".avatarBox").empty().append("<i class='fa fa-user' style='font-size: 25px; margin-top: 7.5px; margin-left: 10px; color: rgba(0,0,0,0.2);'></i>");
    
    $(".myDP").append("<img src='"+myUser.profile_pic+"' class='myDPimage'>");
    $(".myName").html(myUser.name);
    $(".myEmail").html(myUser.email);
    $(".myPhone").html(myUser.mobile);
    
    if(myUser.fbConnected) $(".connectedTo").html("Connected to Facebook");
    else $(".connectedTo").html("Not Connected");
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
