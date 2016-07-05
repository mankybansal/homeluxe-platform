/**
 * Created by mayankbansal on 6/21/16.
 */

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

homeluxeApp.controller("browseStyleControl", function ($scope) {
    getServer();

    $scope.mySplit = function (string, nb) {
        var array = string.split('.');
        return array[nb];
    };

    $scope.getStyles = function () {
        requests.getStyles(function (response) {
            $scope.$apply(function () {
                $scope.$parent.styles = response;
            });

            $('.mainCard').fadeIn(1000).animate({marginTop: '0px'}, 500);

            if (urlStyle != null) {
                var styleNumber;
                for (var i = 0; i < $scope.styles.length; i++)
                    if ($scope.styles[i].catalogueKey == urlStyle)
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

homeluxeApp.controller("styleViewerControl", function ($scope) {

    $scope.init = function () {
        $scope.styles = [];
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
            styleNode: $scope.styles[styleNum].id
        };

        $('.coverImage').empty().append("<img src='images/styles/covers/clear-images/" + $scope.styles[styleNum].cover_pic + "' class='coverPic'>");

        $(".coverBG").css({
            "background": "url('images/styles/covers/blurred-images/" + $scope.styles[styleNum].cover_pic + "')",
            "background-size": "100% 100%",
            "background-repeat": "no-repeat",
            "background-position": "center"
        });

        changeUrlParam('style', $scope.styles[styleNum].catalogueKey);

        if (typeof myRandomToken !== 'undefined') {
            changeUrlParam('token', myRandomToken);
        }

        if ($scope.styles[styleNum].images.length != 0) {
            for (var i = 0; i < $scope.styles[styleNum].images.length; i++)
                $scope.current.images[i] = {
                    "img": $scope.styles[styleNum].name + '/' + $scope.styles[styleNum].images[i].file,
                    "id": $scope.styles[styleNum].images[i].id
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
            name: $scope.styles[$scope.current.style].name + ' on HomeLuxe.in',
            link: window.location.href,
            picture: 'http://www.homeluxe.in/images/styles/' + $scope.styles[$scope.current.style].name + '/' + $scope.styles[$scope.current.style].images[0].file.img,
            caption: 'This style is available on HomeLuxe.in',
            description: $scope.styles[$scope.current.style].description,
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