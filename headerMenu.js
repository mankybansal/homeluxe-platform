var menuState = false;
var homePage = false;

function menuClicked() {
    if (!menuState)
        menuOpen();
    else
        menuClose();
}

function menuContainerClicked() {
    if (menuState) {
        menuClose();
    }
}

function menuClose() {
    menuState = false;
    $(".menuCloseFeedback").stop(true, true).animate({opacity: 0}, 175);
    $(".menuContainer").stop(true, true).fadeOut(175);
    $(".menu").stop(true, true).animate({left: '-270px'}, 175);
    $("#fullpage").stop(true, true).animate({left: '0px'}, 175);
}

function menuOpen() {
    menuState = true;
    $(".menuCloseFeedback").stop(true, true).animate({opacity: 1}, 250);
    $(".menuContainer").stop(true, true).fadeIn(250);
    $(".menu").stop(true, true).animate({left: '0px'}, 250);
    $("#fullpage").stop(true, true).animate({left: '100px'}, 250);
}

function menuHomeClick() {
    menuClose();

    if (homePage) {
        $("html, body").delay(500).animate({
            scrollTop: $('.introSection').offset().top - 40
        }, 1000);
    } else {
        window.location = 'index.html';
    }
}

function menuHowItWorksClick() {
    menuClose();
    if (homePage) {
        $("html, body").delay(500).animate({
            scrollTop: $('.howItWorksSection').offset().top - 40
        }, 1000);
    } else {
        window.location = 'index.html#howItWorksX';
    }
}
function menuWhoWeAreClick() {
    menuClose();
    if (homePage) {
        $("html, body").delay(500).animate({
            scrollTop: $('.whoWeAreSection').offset().top - 40
        }, 1000);
    } else {
        window.location = 'index.html#whoWeAreX';
    }
}
function menuContactClick() {
    menuClose();
    if (homePage) {
        $("html, body").delay(500).animate({
            scrollTop: $('.contactUsSection').offset().top - 40
        }, 1000);
    } else {
        window.location = 'index.html#contactUsX';
    }
}

function menuBrowseClick() {
    window.location = 'browse.php';
}

function menuQuizClick() {
    window.location = 'quiz.html';
}

function loginButtonClick() {
    $('.loginOverlay').fadeIn(500);
}

$(document).ready(function () {
    $(".headerMenu").load("headerMenu.html");
});