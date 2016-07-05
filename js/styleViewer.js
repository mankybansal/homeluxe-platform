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

            styles = response;

            $compile(
                $.each(styles, function (index, item) {

                    if (item.images[0].name != 'NOIMAGE.png') {
                        $('.diamondContainer').append("<div class='diamond' id='styleDia" + index + "' ng-click='viewStyle(" + index + ")'><div  data-adaptive-background data-ab-css-background data-ab-parent='#styleDia" + index + "' class='diamondText' id='style" + index + "' ><div class='textHighlight'>" + item.name + "</div></div></div>");

                        var str = item.images[2].file;
                        var res = str.split(".");

                        $("#style" + index).css({
                            "background": "url('images/styles/" + item.name + "/" + res[0] + "thumb." + res[1] + "')",
                            "background-size": "auto 160%",
                            "background-repeat": "no-repeat",
                            "background-position": "center"
                        });
                    } else {
                        $('.diamondContainer').append("<div class='diamond' ng-click='viewStyle(" + index + ")'><div  class='diamondText' id='style" + index + "' ><div class='textHighlight'>" + item.name + "</div></div></div>");
                        $("#style" + index).css({
                            "background": "url('images/styles/" + item.name + "/" + item.images[2].file + "')",
                            "background-size": "auto 100%",
                            "background-repeat": "no-repeat",
                            "background-position": "center"
                        });
                    }
                })
            )($scope);

            $('.mainCard').fadeIn(1000).animate({marginTop: '0px'}, 500);

            if (urlStyle != null) {
                var styleNumber;
                for (var i = 0; i < styles.length; i++)
                    if (styles[i].catalogueKey == urlStyle)
                        styleNumber = i;
                viewStyle(styleNumber);
            }
        });
    };
    
    $scope.getStyles();
});


homeluxeApp.controller("styleViewerControl", function ($scope) {

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

        $scope.currentStyleNode = styles[styleNum].id;

        $('.coverImage').empty().append("<img src='images/styles/covers/clear-images/" + styles[styleNum].cover_pic + "' class='coverPic'>");

        $(".coverBG").css({
            "background": "url('images/styles/covers/blurred-images/" + styles[styleNum].cover_pic + "')",
            "background-size": "100% 100%",
            "background-repeat": "no-repeat",
            "background-position": "center"
        });
        $('.coverTitle').html("This style is called <b>" + styles[styleNum].name + "</b>!");
        $('.coverTextBox').html(styles[styleNum].description);
        $(".viewStyleTitle2").html(styles[styleNum].name);

        changeUrlParam('style', styles[styleNum].catalogueKey);

        if (typeof myRandomToken !== 'undefined') {
            changeUrlParam('token', myRandomToken);
        }

        $scope.images = [];

        if (styles[styleNum].images.length != 0) {
            for (var i = 0; i < styles[styleNum].images.length; i++) {
                $scope.images[i] = {
                    "img": styles[styleNum].name + '/' + styles[styleNum].images[i].file,
                    "id": styles[styleNum].images[i].id
                };
            }

            loadImage();
        } else {
            $('.leftNav').hide();
            $('.rightNav').hide();
        }

        if (styles[styleNum].images.length == 1) {
            $('.leftNav').hide();
            $('.rightNav').hide();
        }
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

function loadImage() {
    currentImageNode = images[currentImage].id;
    updateLikes(currentStyleNode, currentImageNode);
    $(".styleContainer").css({
        "background": "url('images/styles/" + images[currentImage].img + "')",
        "background-size": "contain",
        "background-repeat": "no-repeat",
        "background-position": "center"
    });
}

function leftNavClick() {
    currentImage -= 1;
    $('.leftNav').show();
    $('.rightNav').show();
    if (currentImage < 0) {
        currentImage = 0;
        $('.leftNav').hide();
    }
    loadImage();
}

function rightNavClick() {
    currentImage++;
    $('.leftNav').show();
    $('.rightNav').show();
    if (currentImage > (images.length - 1)) {
        currentImage = images.length - 1;
        $('.rightNav').hide();
    }
    loadImage();
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