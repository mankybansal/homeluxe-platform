//var myUser;


var homeluxeApp = angular.module('homeluxeApp', ['ngRoute']);

homeluxeApp.controller("userControl", function ($scope, $interval, $window, $rootScope) {

    $scope.regFBID = null;
    $scope.regFBDP = null;
    $scope.regFBName = null;
    $scope.regFBEmail = null;
    $scope.fbConnected = null;
    $scope.guest = {};


    $scope.hideMenuOverlay = function () {
        $('.loginOverlay').fadeOut(500);
    };

    $scope.isValid = function (value) {
        return !value
    };

    $scope.login = function () {
        console.log($scope.guest.username, $scope.guest.password);
        if ($scope.isValid($scope.guest.username) && $scope.isValid($scope.guest.password)) {
            requests.userLogin($scope.guest.username, $scope.guest.password, function (response) {
                $scope.$apply(function () {
                    if (response.status == "Success") {
                        $scope.ngMyUser = response;
                        $scope.loginSuccess();
                    }
                    else showAlert('Wrong username or password.');
                });
            });
        }
        else showAlert('Please enter a username & password.');
        if (typeof dashboard != 'undefined' && dashboard) showDashboard();
    };

    $scope.submitRegister = function () {
        var rname = $('#regName').val();
        var remail = $('#regEmail').val();
        var rphone = $('#regPhone').val();
        var rpassword = $('#regPassword').val();

        if (rname != "" && remail != "" && rpassword != "" && rphone != "") {
            requests.userRegiserForm(rname, remail, rphone, rpassword, function (response) {
                if (response.status == "Success")
                    $scope.login(remail, rpassword);
                else if (response.status == "Failed" && response.message == "User already exists")
                    showAlert('You already have an account.');
                else showAlert('Please fill the form correctly.');
            });
        } else showAlert('Please fill the form correctly.');
    };

    $scope.showLogin = function () {
        $(".loginContainer").animate({"height": "440px"}, 500);
        $(".registerPanel").hide();
        setTimeout(function () {
            $(".loginPanel").fadeIn(500);
        }, 200);
        var spacerHeight = $(".loginSpacer").height();
        $(".loginSpacer").animate({"height": spacerHeight + 65}, 500);
    };

    $scope.userRegister = function () {
        $(".loginContainer").animate({"height": "570px"}, 500);
        $(".loginPanel").hide();
        setTimeout(function () {
            $(".registerPanel").fadeIn(500);
        }, 200);
        var spacerHeight = $(".loginSpacer").height();
        $(".loginSpacer").animate({"height": spacerHeight - 65}, 500);
    };

    $scope.facebookRegister = function () {
        requests.userRegisterFacebook($scope.regFBName, $scope.regFBEmail, $scope.regFBID, $scope.regFBDP, function (response) {
            console.log(response);
            $scope.fbConnected = true;
            $scope.login($scope.regFBEmail, $scope.regFBID);
        });
    };

    $scope.facebookLogin = function () {
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
                        $scope.$apply(function () {
                            if (response.status == "Success") {
                                $scope.ngMyUser = response;
                                //myUser = response;
                                fbConnected = true;
                                $scope.loginSuccess();
                            }
                            else facebookRegister();
                        });
                    });
                });
            }
            else console.log('User cancelled login or did not fully authorize.');
        }, {scope: 'email,public_profile'});
    };

    $scope.checkCookie = function () {
        console.log('CHECK COOKIE');
        console.log($scope.ngMyUser);
        if (!($scope.ngMyUser = Cookies.getJSON('myUser')))
            $scope.ngMyUser = false;
    };

    $scope.init = function () {
        $scope.checkCookie();
        $scope.accountOptions = false;
        $scope.ngMyUser = false;
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
        $scope.ngMyUser.fbConnected = fbConnected;
        Cookies.set('myUser', $scope.ngMyUser);
        $('.alertMessage').hide();
        $('.loginOverlay').hide();
        if (typeof dashboard != 'undefined' && dashboard) showDashboard();
    };

    $scope.init();
});

homeluxeApp.directive("headerMenu", function ($templateRequest, $compile) {
    return {
        restrict: "AE",
        link: function (scope, element) {
            $templateRequest("headerMenu.html").then(function (html) {
                var template = angular.element(html);
                element.append(template);
                $compile(template)(scope);
            });
        }
    }
});

homeluxeApp.directive("loginOverlay", function ($templateRequest, $compile) {
    return {
        restrict: "AE",
        link: function (scope, element) {
            $templateRequest("loginOverlay.html").then(function (html) {
                var template = angular.element(html);
                element.append(template);
                $compile(template)(scope);
            });
        }
    }
});

//Hide Overlay
// function hideLoginOverlay() {
//     $('.loginOverlay').fadeOut(500);
// }

// Show Alert Message
function showAlert(message) {
    $(".alertMessage").fadeIn(300).html(message);
}

// Function for Checking if User is logged in & valid
// function checkCookie() {
//     console.log('CHECK COOKIE');
//     console.log(myUser);
//     if (myUser = Cookies.getJSON('myUser')) {
//         //$(".myAccount").html(myUser.name + "&nbsp;&nbsp;<i class='fa fa-user'></i>");
//         $(".loginTrigger").attr("onclick", "gotoDashboard()");
//     } else {
//         //$(".myAccount").html("LOGIN/SIGN-UP");
//         $(".loginTrigger").attr("onclick", "loginButtonClick()");
//     }
// }
//
// function gotoDashboard() {
//     window.location = baseURL + "accounts/";
// }

// Function Called After Successful Login
// function loginSuccess() {
//     // SET COOKIES
//     myUser.fbConnected = fbConnected;
//     Cookies.set('myUser', myUser);
//     $('.alertMessage').hide();
//     $('.loginOverlay').hide();
//     $(".loginTrigger").attr("onclick", "gotoDashboard()");
//     if (typeof dashboard != 'undefined' && dashboard) showDashboard();
// }

// Login to HomeLuxe (NOT oAUTH)
// function login(username, password) {
//     if (username != "" && password != "") {
//         requests.userLogin(username, password, function (response) {
//             if (response.status == "Success") {
//                 myUser = response;
//                 loginSuccess();
//             }
//             else showAlert('Wrong username or password.');
//         });
//     }
//     else showAlert('Please enter a username & password.');
//     if (typeof dashboard != 'undefined' && dashboard) showDashboard();
// }
//
// // Submit Registration Form (NOT oAUTH)
// function submitRegister() {
//     var rname = $('#regName').val();
//     var remail = $('#regEmail').val();
//     var rphone = $('#regPhone').val();
//     var rpassword = $('#regPassword').val();
//
//     if (rname != "" && remail != "" && rpassword != "" && rphone != "") {
//         requests.userRegiserForm(rname, remail, rphone, rpassword, function (response) {
//             if (response.status == "Success")
//                 login(remail, rpassword);
//             else if (response.status == "Failed" && response.message == "User already exists")
//                 showAlert('You already have an account.');
//             else showAlert('Please fill the form correctly.');
//         });
//     } else showAlert('Please fill the form correctly.');
// }


// Show Login Form
// function showLogin() {
//     $(".loginContainer").animate({"height": "440px"}, 500);
//     $(".registerPanel").hide();
//     setTimeout(function () {
//         $(".loginPanel").fadeIn(500);
//     }, 200);
//     var spacerHeight = $(".loginSpacer").height();
//     $(".loginSpacer").animate({"height": spacerHeight + 65}, 500);
// }


// Show Registration Form
// function userRegister() {
//     $(".loginContainer").animate({"height": "570px"}, 500);
//     $(".loginPanel").hide();
//     setTimeout(function () {
//         $(".registerPanel").fadeIn(500);
//     }, 200);
//     var spacerHeight = $(".loginSpacer").height();
//     $(".loginSpacer").animate({"height": spacerHeight - 65}, 500);
// }

// INITIALIZE Facebook App Access
window.fbAsyncInit = function () {
    FB.init({
        appId: '607233152758333',
        cookie: true,  // enable cookies to allow the server to access the session
        xfbml: true,  // parse social plugins on this page
        version: 'v2.6' // use graph api version 2.5
    });
};
//
// function facebookRegister() {
//     requests.userRegisterFacebook(regFBName, regFBEmail, regFBID, regFBDP, function (response) {
//         console.log(response);
//         fbConnected = true;
//         login(regFBEmail, regFBID);
//     });
// }

// Login to HomeLuxe (oAuth - FACEBOOK)
// function facebookLogin() {
//     FB.login(function (response) {
//         console.log(response);
//         if (response.authResponse) {
//             showAlert("Please wait... &nbsp; <i class='fa fa-circle-o-notch fa-spin'></i>");
//
//             FB.api('/me/picture?type=normal', function (response) {
//                 regFBDP = response.data.url;
//                 console.log(response.data.url);
//             });
//
//             FB.api('/me?fields=name,picture,email,id,link', function (response) {
//
//                 regFBName = response.name;
//                 regFBEmail = response.email;
//                 regFBID = response.id;
//
//                 console.log(response);
//
//                 requests.userLogin(response.email, response.id, function (response) {
//                     if (response.status == "Success") {
//                         myUser = response;
//                         fbConnected = true;
//                         loginSuccess();
//                     }
//                     else facebookRegister();
//                 });
//             });
//         }
//         else console.log('User cancelled login or did not fully authorize.');
//     }, {scope: 'email,public_profile'});
// }

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

// $(document).ready(function () {
//     checkCookie();
//     setInterval(function () {
//         checkCookie();
//     }, 3000);
//
//     $(".loginButton").click(function () {
//         $(".loginOverlay").fadeIn(500);
//     });
//
//     if (typeof dashboard != 'undefined' && dashboard) $(".loginOverlay").load("../loginOverlay.html");
//     else $(".loginOverlay").load("loginOverlay.html");
// });
