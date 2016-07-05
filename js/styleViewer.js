/**
 * Created by mayankbansal on 6/21/16.
 */

// var images = [];
// var currentImage = 0;
// var currentStyle;
//
// var currentStyleNode;
// var currentImageNode;

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
var myUser;

function updateLikes(styleNode, imageNode) {
    if (myUser = Cookies.getJSON("myUser"))
        requests.getLikes(myUser.token, function (response) {
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
}

function likeStyle() {
    if (myUser = Cookies.getJSON("myUser"))
        requests.likeNode(myUser.token, currentStyleNode, function (response) {
            if (response.status == "Success")
                $(".changeHeartStyle").removeClass("fa-heart-o").addClass("fa-heart");
            else if (response.message == "Invalid token detected")
                logout();
            else
                console.log("Some Error Occurred");
        });
    else loginButtonClick();
}

function likeRoom() {
    if (myUser = Cookies.getJSON("myUser"))
        requests.likeNode(myUser.token, currentImageNode, function (response) {
            if (response.status == "Success")
                $(".changeHeartRoom").removeClass("fa-heart-o").addClass("fa-heart");
            else
                console.log("Some Error Occurred");
        });
    else
        loginButtonClick();
}

homeluxeApp.controller("browseStyleControl", function ($scope, $compile) {
   getServer();

    $scope.getStyles = function () {
        requests.getStyles(function (response) {
            $scope.$apply(function () {
                $scope.$parent.styles = response;
            });

            // $.each(styles, function (index, item) {
            //     $('.diamondContainer').append("<div class='diamond' id='styleDia" + index + "' ng-click='viewStyle(" + index + ")'><div class='diamondText' id='style" + index + "' ><div class='textHighlight'>" + item.name + "</div></div></div>");
            //
            //     var str = item.images[2].file;
            //     var res = str.split(".");
            //
            //     $("#style" + index).css({
            //         "background": "url('images/styles/" + item.name + "/" + res[0] + "thumb." + res[1] + "')",
            //         "background-size": "auto 160%",
            //         "background-repeat": "no-repeat",
            //         "background-position": "center"
            //     });
            // });


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

    $scope.viewStyle = function (styleNum){
        $scope.$parent.viewStyle(styleNum);
    }

});


homeluxeApp.controller("styleViewerControl", function ($scope) {

    $scope.styles = [];

    $scope.init = function () {
        $scope.images = [];
        $scope.currentImage = 0;
        $scope.currentStyle = null;
        $scope.currentStyleNode = null;
        $scope.currentImageNode = null;
    };

    $scope.viewStyle = function (styleNum) {
        $('.leftNav').hide();

        $scope.currentImage = 0;
        $('.coverContainer').fadeIn(500);

        $scope.currentStyle = styleNum;
        $('.resultCard').fadeIn(500);
        $('.centerDesc').fadeIn(500);

        $scope.currentStyleNode = $scope.styles[styleNum].id;

        $('.coverImage').empty().append("<img src='images/styles/covers/clear-images/" + $scope.styles[styleNum].cover_pic + "' class='coverPic'>");

        $(".coverBG").css({
            "background": "url('images/styles/covers/blurred-images/" + $scope.styles[styleNum].cover_pic + "')",
            "background-size": "100% 100%",
            "background-repeat": "no-repeat",
            "background-position": "center"
        });
        $('.coverTitle').html("This style is called <b>" + $scope.styles[styleNum].name + "</b>!");
        $('.coverTextBox').html($scope.styles[styleNum].description);
        $(".viewStyleTitle2").html($scope.styles[styleNum].name);

        changeUrlParam('style', $scope.styles[styleNum].catalogueKey);

        // if (typeof myRandomToken !== 'undefined') {
        //     changeUrlParam('token', myRandomToken);
        // }

        $scope.images = [];

        if ($scope.styles[styleNum].images.length != 0) {
            for (var i = 0; i < $scope.styles[styleNum].images.length; i++) {
                $scope.images[i] = {
                    "img": $scope.styles[styleNum].name + '/' + $scope.styles[styleNum].images[i].file,
                    "id": $scope.styles[styleNum].images[i].id
                };
            }

            $scope.loadImage();
        } else {
            $('.leftNav').hide();
            $('.rightNav').hide();
        }

        if ($scope.styles[styleNum].images.length == 1) {
            $('.leftNav').hide();
            $('.rightNav').hide();
        }

        console.log($scope.images);

    };

    $scope.leftNavClick = function () {
        $scope.currentImage -= 1;
        $('.leftNav').show();
        $('.rightNav').show();
        if ($scope.currentImage < 0) {
            $scope.currentImage = 0;
            $('.leftNav').hide();
        }
        console.log($scope.currentImage);
        $scope.loadImage();
    };

    $scope.rightNavClick = function () {
        $scope.currentImage++;
        $('.leftNav').show();
        $('.rightNav').show();
        console.log($scope.currentImage);
        if ($scope.currentImage > ($scope.images.length - 1)) {
            $scope.currentImage = $scope.images.length - 1;
            $('.rightNav').hide();
        }
        $scope.loadImage();
    };

    $scope.loadImage = function () {
        $scope.currentImageNode = $scope.images[$scope.currentImage].id;
        //updateLikes($scope.currentStyleNode, $scope.currentImageNode);
        $(".styleContainer").css({
            "background": "url('images/styles/" + $scope.images[$scope.currentImage].img + "')",
            "background-size": "contain",
            "background-repeat": "no-repeat",
            "background-position": "center"
        });
    };

    $scope.init();
});


// function viewStyle(styleNum) {
//
//     $('.leftNav').hide();
//
//     currentImage = 0;
//     $('.coverContainer').fadeIn(500);
//
//     currentStyle = styleNum;
//     $('.resultCard').fadeIn(500);
//     $('.centerDesc').fadeIn(500);
//
//     currentStyleNode = styles[styleNum].id;
//
//     $('.coverImage').empty().append("<img src='images/styles/covers/clear-images/" + styles[styleNum].cover_pic + "' class='coverPic'>");
//
//     $(".coverBG").css({
//         "background": "url('images/styles/covers/blurred-images/" + styles[styleNum].cover_pic + "')",
//         "background-size": "100% 100%",
//         "background-repeat": "no-repeat",
//         "background-position": "center"
//     });
//     $('.coverTitle').html("This style is called <b>" + styles[styleNum].name + "</b>!");
//     $('.coverTextBox').html(styles[styleNum].description);
//     $(".viewStyleTitle2").html(styles[styleNum].name);
//
//     changeUrlParam('style', styles[styleNum].catalogueKey);
//
//     if (typeof myRandomToken !== 'undefined') {
//         changeUrlParam('token', myRandomToken);
//     }
//
//     images = [];
//
//     if (styles[styleNum].images.length != 0) {
//         for (var i = 0; i < styles[styleNum].images.length; i++) {
//             images[i] = {
//                 "img": styles[styleNum].name + '/' + styles[styleNum].images[i].file,
//                 "id": styles[styleNum].images[i].id
//             };
//         }
//
//         loadImage();
//     } else {
//         $('.leftNav').hide();
//         $('.rightNav').hide();
//     }
//
//     if (styles[styleNum].images.length == 1) {
//         $('.leftNav').hide();
//         $('.rightNav').hide();
//     }
//
// }

function callDesigner() {
    window.location = 'index.php#contactUsX';
}

function coverContainerClose() {
    $('.coverContainer').hide();
}

function fbShare() {
    FB.ui({
        method: 'feed',
        name: styles[currentStyle].name + ' on HomeLuxe.in',
        link: window.location.href,
        picture: 'http://www.homeluxe.in/images/styles/' + styles[currentStyle].name + '/' + styles[currentStyle].images[0].file.img,
        caption: 'This style is available on HomeLuxe.in',
        description: styles[currentStyle].description,
        message: 'Check out this style. It looks absolutely beautiful! :)'
    });
}