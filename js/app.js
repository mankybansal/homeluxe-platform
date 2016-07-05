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

homeluxeApp.controller("quizAppControl", function($scope, $rootScope){

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
                $rootScope.styles = response;
                $scope.$parent.viewStyle(0);
            });
        }
    };

    $scope.saveAnswer = function (myAnswer) {
        $scope.myAnswers.push(myAnswer);
        $scope.currentQuestion++;
        $scope.getNextQuestion();
    };
});

homeluxeApp.controller("browseStyleControl", function ($scope,$rootScope) {
    getServer();

    $scope.mySplit = function (string, nb) {
        var array = string.split('.');
        return array[nb];
    };

    $scope.getStyles = function () {
        requests.getStyles(function (response) {
            $scope.$apply(function () {
                $rootScope.styles = response;
            });

            $('.mainCard').fadeIn(1000).animate({marginTop: '0px'}, 500);

            if (urlStyle != null) {
                var styleNumber;
                for (var i = 0; i < $rootScope.styles.length; i++)
                    if ($rootScope.styles[i].catalogueKey == urlStyle)
                        styleNumber = i;
                $scope.viewStyle(styleNumber);
            }
        });
    };

    $scope.getStyles();

    $scope.viewStyle = function (styleNum) {
        $scope.$parent.viewStyle(styleNum);
    }

});

homeluxeApp.controller("styleViewerControl", function ($scope,$rootScope) {

    $scope.init = function () {
        $rootScope.styles = [];
        $scope.current = {
            image: 0,
            images: [],
            style: null,
            styleNode: null,
            imageNode: null
        };
    };

    $scope.updateLikes = function (styleNode, imageNode) {
        if ($scope.$parent.ngMyUser = Cookies.getJSON("myUser"))
            requests.getLikes($scope.$parent.ngMyUser.token, function (response) {
                if (response.success != "false") {
                    var flag1 = false, flag2 = false;
                    $.each(response, function (index, item) {
                        if (item.id == styleNode) {
                            $(".changeHeartStyle").removeClass("fa-heart-o").addClass("fa-heart");
                            flag1 = true;
                        }
                        if (item.id == imageNode) {
                            $(".changeHeartRoom").removeClass("fa-heart-o").addClass("fa-heart");
                            flag2 = true;
                        }
                    });
                    if (!flag1) $(".changeHeartStyle").removeClass("fa-heart").addClass("fa-heart-o")
                    if (!flag2) $(".changeHeartRoom").removeClass("fa-heart").addClass("fa-heart-o");
                }
            });
    };

    $scope.likeStyle = function () {
        if ($scope.$parent.ngMyUser = Cookies.getJSON("myUser"))
            requests.likeNode($scope.$parent.ngMyUser.token, $scope.current.styleNode, function (response) {
                if (response.status == "Success")
                    $(".changeHeartStyle").removeClass("fa-heart-o").addClass("fa-heart");
                else if (response.message == "Invalid token detected")
                    $scope.$parent.logout();
                else
                    console.log("Some Error Occurred");
            });
        else loginButtonClick();
    };

    $scope.likeRoom = function () {
        if ($scope.$parent.ngMyUser = Cookies.getJSON("myUser"))
            requests.likeNode($scope.$parent.ngMyUser.token, $scope.current.imageNode, function (response) {
                if (response.status == "Success")
                    $(".changeHeartRoom").removeClass("fa-heart-o").addClass("fa-heart");
                else if (response.message == "Invalid token detected")
                    $scope.$parent.logout();
                else
                    console.log("Some Error Occurred");
            });
        else
            loginButtonClick();
    };

    $scope.viewStyle = function (styleNum) {

        $('.coverContainer').fadeIn(500);
        $('.resultCard').fadeIn(500);
        $('.centerDesc').fadeIn(500);

        $scope.current = {
            image: 0,
            images: [],
            style: styleNum,
            styleNode: $rootScope.styles[styleNum].id
        };

        $('.coverImage').empty().append("<img src='images/styles/covers/clear-images/" + $rootScope.styles[styleNum].cover_pic + "' class='coverPic'>");

        $(".coverBG").css({
            "background": "url('images/styles/covers/blurred-images/" + $rootScope.styles[styleNum].cover_pic + "')",
            "background-size": "100% 100%",
            "background-repeat": "no-repeat",
            "background-position": "center"
        });

        changeUrlParam('style', $rootScope.styles[styleNum].catalogueKey);

        if (typeof myRandomToken !== 'undefined') {
            changeUrlParam('token', myRandomToken);
        }

        if ($rootScope.styles[styleNum].images.length != 0) {
            for (var i = 0; i < $rootScope.styles[styleNum].images.length; i++)
                $scope.current.images[i] = {
                    "img": $rootScope.styles[styleNum].name + '/' + $rootScope.styles[styleNum].images[i].file,
                    "id": $rootScope.styles[styleNum].images[i].id
                };
            $scope.loadImage();
        }
    };

    $scope.leftNavClick = function () {
        $scope.current.image -= 1;
        if ($scope.current.image <= 0)
            $scope.current.image = 0;
        $scope.loadImage();
    };

    $scope.rightNavClick = function () {
        $scope.current.image++;
        if ($scope.current.image >= ($scope.current.images.length - 1))
            $scope.current.image = $scope.current.images.length - 1;
        $scope.loadImage();
    };

    $scope.loadImage = function () {
        $scope.current.imageNode = $scope.current.images[$scope.current.image].id;
        $scope.updateLikes($scope.current.styleNode, $scope.current.imageNode);
        $(".styleContainer").css({
            "background": "url('images/styles/" + $scope.current.images[$scope.current.image].img + "')",
            "background-size": "contain",
            "background-repeat": "no-repeat",
            "background-position": "center"
        });
    };

    $scope.fbShare = function() {
        FB.ui({
            method: 'feed',
            name: $rootScope.styles[$scope.current.style].name + ' on HomeLuxe.in',
            link: window.location.href,
            picture: 'http://www.homeluxe.in/images/styles/' + $rootScope.styles[$scope.current.style].name + '/' + $rootScope.styles[$scope.current.style].images[0].file.img,
            caption: 'This style is available on HomeLuxe.in',
            description: $rootScope.styles[$scope.current.style].description,
            message: 'Check out this style. It looks absolutely beautiful! :)'
        });
    };

    $scope.callDesigner = function() {
        window.location = 'index.php#contactUsX';
    };

    $scope.coverContainerClose = function() {
        $('.coverContainer').hide();
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

homeluxeApp.directive("styleViewer", function ($templateRequest, $compile) {
    return {
        restrict: "AE",
        link: function (scope, element) {
            $templateRequest("styleViewer.html").then(function (html) {
                var template = angular.element(html);
                element.append(template);
                $compile(template)(scope);
            });
        }
    }
});

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

var urlStyle = getURLParameter('style');

function changeUrlParam(param, value) {
    var currentURL = window.location.href + '&';
    var change = new RegExp('(' + param + ')=(.*)&', 'g');
    var newURL = currentURL.replace(change, '$1=' + value + '&');

    if (getURLParameter(param) !== null) {
        try {
            window.history.replaceState('', '', newURL.slice(0, -1));
        } catch (e) {
            console.log(e);
        }
    } else {
        var currURL = window.location.href;
        if (currURL.indexOf("?") !== -1) {
            window.history.replaceState('', '', currentURL.slice(0, -1) + '&' + param + '=' + value);
        } else {
            window.history.replaceState('', '', currentURL.slice(0, -1) + '?' + param + '=' + value);
        }
    }
}

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