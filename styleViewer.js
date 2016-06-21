/**
 * Created by mayankbansal on 6/21/16.
 */



var images = [];
var currentImage = 0;
var currentStyle;

var currentStyleNode;
var currentImageNode;

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

function updateLikes(styleNode, imageNode) {

    if ($.cookie("myUser-token")) {
        $.ajax({
            type: "POST",
            dataType: "json",
            data: {
                "token": myUser.token,
            },
            url: "http://homeluxe.in:3000/member/likes",
            success: function (data) {
                if (data.success != "false") {

                    var flag1 = false, flag2 = false;

                    $.each(data, function (index, item) {
                        if (item.id == styleNode) {
                            $(".changeHeartStyle").removeClass("fa-heart-o").addClass("fa-heart");
                            flag1 = true;
                        }

                        if (item.id == imageNode) {
                            $(".changeHeartRoom").removeClass("fa-heart-o").addClass("fa-heart");
                            flag2 = true;
                        }
                    });

                    if (!flag1) {
                        $(".changeHeartStyle").removeClass("fa-heart").addClass("fa-heart-o")
                    }

                    if (!flag2) {
                        ;
                        $(".changeHeartRoom").removeClass("fa-heart").addClass("fa-heart-o");
                    }
                }
            },
            error: function (data) {
                console.log("An unknown error occurred.");
            }
        });
    }
}

function viewStyle(styleNum) {


    $('.leftNav').hide();

    currentImage = 0;
    $('.coverContainer').fadeIn(500);


    currentStyle = styleNum;
    $('.resultCard').fadeIn(500);
    $('.centerDesc').fadeIn(500);

    currentStyleNode = styles[styleNum].id;


    $('.coverBG').css("background", "url('images/styles/covers/blurred-images/" + styles[styleNum].cover_pic + "')");
    $('.coverImage').empty().append("<img src='images/styles/covers/clear-images/" + styles[styleNum].cover_pic + "' class='coverPic'>");

    $(".coverBG").css("background-size", "100% 100%");
    $(".coverBG").css("background-repeat", "no-repeat");
    $(".coverBG").css("background-position", "center");
    $('.coverTitle').html("This style is called <b>" + styles[styleNum].name + "</b>!");
    $('.coverTextBox').html(styles[styleNum].description);

    changeUrlParam('style', styles[styleNum].catalogueKey);
    
    if(typeof myRandomToken !== 'undefined'){
        changeUrlParam('token', myRandomToken);
    }
    
    console.log("CALLED");

    images = [];

    console.log("BEFORE: " + images);

    if (styles[styleNum].images.length != 0) {
        for (var i = 0; i < styles[styleNum].images.length; i++) {
            images[i] = {
                "img": styles[styleNum].name + '/' + styles[styleNum].images[i].file,
                "id": styles[styleNum].images[i].id
            };
        }

        currentImageNode = images[currentImage].id;

        updateLikes(currentStyleNode, currentImageNode);
        console.log("current" + currentImageNode);
        console.log(images);
        $(".styleContainer").css("background", "url('images/styles/" + images[currentImage].img + "')");
        $(".viewStyleTitle").html("<b>" + styles[styleNum].name + "</b>");
        $(".viewStyleTitle2").html(styles[styleNum].name);
        $(".viewStyleDesc").html(styles[styleNum].description);
        $(".styleContainer").css("background-size", "contain");
        $(".styleContainer").css("background-repeat", "no-repeat");
        $(".styleContainer").css("background-position", "center");
        //$.adaptiveBackground.run();

    } else {
        console.log("NO IMAGES FOR STYLE");
        $('.leftNav').hide();
        $('.rightNav').hide();
    }

    if (styles[styleNum].images.length == 1) {
        $('.leftNav').hide();
        $('.rightNav').hide();
    }

}

function likeStyle() {
    if ($.cookie("myUser-token")) {
        $.ajax({
            type: "POST",
            dataType: "json",
            data: {
                "token": myUser.token,
                "like_node": currentStyleNode
            },
            url: "http://homeluxe.in:3000/member/like",
            success: function (data) {
                if (data.status == "Success") {
                    $(".changeHeartStyle").removeClass("fa-heart-o").addClass("fa-heart");
                } else {
                    console.log("Some Error Occured");
                }
            },
            error: function (data) {
                console.log("Some Error Occured");
            }
        });
    } else {
        window.open("http://www.homeluxe.in/accounts");
    }
}

function likeRoom() {
    if ($.cookie("myUser-token")) {
        $.ajax({
            type: "POST",
            dataType: "json",
            data: {
                "token": myUser.token,
                "like_node": currentImageNode
            },
            url: "http://homeluxe.in:3000/member/like",
            success: function (data) {
                if (data.status == "Success") {
                    $(".changeHeartRoom").removeClass("fa-heart-o").addClass("fa-heart");
                } else {
                    console.log("Some Error Occured");
                }
            },
            error: function (data) {
                console.log("Some Error Occured");
            }
        });
    } else {
        window.open("http://www.homeluxe.in/accounts");
    }
}

function callDesigner() {
    window.location = 'index.html#contactUsX';
}

function coverContainerClose() {
    $('.coverContainer').hide();
}

function leftNavClick() {
    console.log("Current" + currentImage);
    currentImage -= 1;
    $('.leftNav').show();
    $('.rightNav').show();
    if (currentImage < 0) {
        currentImage = 0;
        $('.leftNav').hide();
    }
    console.log("LEFT" + currentImage);


    currentImageNode = images[currentImage].id;
    console.log("currentNode" + currentImageNode);
    updateLikes(currentStyleNode, currentImageNode);

    $(".styleContainer").css("background", "url('images/styles/" + images[currentImage].img + "')");
    $(".styleContainer").css("background-size", "contain");
    $(".styleContainer").css("background-repeat", "no-repeat");
    $(".styleContainer").css("background-position", "center");
    //$.adaptiveBackground.run();
}

function rightNavClick() {
    console.log("Current" + currentImage);
    currentImage++;
    $('.leftNav').show();
    $('.rightNav').show();
    if(currentImage > (images.length - 1)){
        currentImage = images.length - 1;
        $('.rightNav').hide();
    }
    console.log("RIGHT " + currentImage);


    currentImageNode = images[currentImage].id;

    console.log("currentNode" + currentImageNode);
    updateLikes(currentStyleNode, currentImageNode);

    $(".styleContainer").css("background", "url('images/styles/" + images[currentImage].img + "')");
    $(".styleContainer").css("background-size", "contain");
    $(".styleContainer").css("background-repeat", "no-repeat");
    $(".styleContainer").css("background-position", "center");
    //$.adaptiveBackground.run();
}

function fbShare() {
    FB.ui(
        {
            method: 'feed',
            name: styles[currentStyle].name + ' on HomeLuxe.in',
            link: window.location.href,
            picture: 'http://www.homeluxe.in/images/styles/' + styles[currentStyle].name + '/' + styles[currentStyle].images[0].file.img,
            caption: 'This style is available on HomeLuxe.in',
            description: styles[currentStyle].description,
            message: 'Check out this style. It looks absolutely beautiful! :)'
        });
}

$(document).ready(function () {

    $('.styleViewer').load('styleViewer.html');

});