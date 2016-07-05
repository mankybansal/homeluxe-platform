var homeluxeApp = angular.module('homeluxeApp', ['ngRoute']);

homeluxeApp.controller("userControl", function ($scope, $interval) {

    $scope.hideMenuOverlay = function () {
        $('.loginOverlay').fadeOut(500);
    };

    $scope.isValid = function (value) {
        return (typeof value != 'undefined' && value != "");
    };

    $scope.login = function () {
        if ($scope.isValid($scope.guest.username) && $scope.isValid($scope.guest.password))
            requests.userLogin($scope.guest.username, $scope.guest.password, function (response) {
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
       if ($scope.isValid($scope.register.name) && $scope.isValid($scope.register.email) && $scope.isValid($scope.register.password) && $scope.isValid($scope.register.phone))
            requests.userRegiserForm($scope.register.name,$scope.register.email,$scope.register.phone,$scope.register.password, function (response) {
                if (response.status == "Success")
                    $scope.login($scope.register.email,$scope.register.password);
                else if (response.status == "Failed" && response.message == "User already exists")
                    showAlert('You already have an account.');
                else showAlert('Please fill the form correctly.');
            });
       else showAlert('Please fill the form correctly.');
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
                    $scope.regFBDP = response.data.url;
                    console.log(response.data.url);
                });

                FB.api('/me?fields=name,picture,email,id,link', function (response) {

                    $scope.regFBName = response.name;
                    $scope.regFBEmail = response.email;
                    $scope.regFBID = response.id;

                    console.log(response);

                    requests.userLogin(response.email, response.id, function (response) {
                        $scope.$apply(function () {
                            if (response.status == "Success") {
                                $scope.ngMyUser = response;
                                //myUser = response;
                                $scope.fbConnected = true;
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
        $scope.regFBID = null;
        $scope.regFBDP = null;
        $scope.regFBName = null;
        $scope.regFBEmail = null;
        $scope.fbConnected = null;
        $scope.guest = {};
        $scope.register = {};

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
        if ($scope.fbConnected) $scope.ngMyUser.fbConnected = $scope.fbConnected;
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

// Show Alert Message
function showAlert(message) {
    $(".alertMessage").fadeIn(300).html(message);
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
