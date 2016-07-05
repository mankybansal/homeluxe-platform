var homeluxeApp = angular.module('homeluxeApp', ['ngRoute']);

homeluxeApp.controller("userControl", function ($scope, $interval) {

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
        if ($scope.isValid($scope.guest.name) && $scope.isValid($scope.guest.email) && $scope.isValid($scope.guest.password) && $scope.isValid($scope.guest.phone))
            requests.userRegiserForm($scope.guest.name, $scope.guest.email, $scope.guest.phone, $scope.guest.password, function (response) {
                if (response.status == "Success")
                    $scope.login();
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


var styles;

homeluxeApp.controller("quizAppController", function($scope){

    $scope.startQuiz = function(){
        $scope.currentQuestion = 0;
        $scope.myAnswers = [];
        $scope.myProgress = 0;
        $scope.quizOver = false;
        $scope.inProgress = true;
        requests.getQuiz(function(response){
            $scope.$apply(function () {
                $scope.questions = response;
                $scope.getNextQuestion();
            });
        });
    };

    $scope.getNextQuestion = function () {
        $scope.myProgress += 100 / ($scope.questions.length + 1);
        if (!($scope.question = $scope.questions[$scope.currentQuestion])) {
            $scope.quizOver = true;
            requests.submitQuiz($scope.myAnswers.join(), function (response) {
                styles = response;
                viewStyle(0);
            });
        }
    };

    $scope.saveAnswer = function (myAnswer) {
        $scope.myAnswers.push(myAnswer);
        $scope.currentQuestion++;
        $scope.getNextQuestion();
    };

});
