<!DOCTYPE html>
<html lang="en">
<head>


    <meta name=viewport content="width=device-width, initial-scale=1">

    <script>
        var myRandomToken = "";
    </script>


    <?php

    function generateRandomString($length = 10)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    $myStyle = "";
    if (isset($_GET['style'])) {
        $myStyle = $_GET['style'];

        $ch = curl_init('http://homeluxe.in:3000/getToken');
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);


        $result = curl_exec($ch);
        $result = json_decode($result, true);

        $data = array("token" => $result['token']);
        $data_string = json_encode($data);

        $ch = curl_init('http://homeluxe.in:3000/browse');
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($data_string))
        );

        $result = curl_exec($ch);
        $result = json_decode($result, true);

        $randomString = generateRandomString();

        for ($i = 0; $i < count($result); $i++) {
            if ($result[$i]["catalogueKey"] == $myStyle) {


                $imgURL = str_replace(" ", "%20", "http://homeluxe.in/images/styles/" . $result[$i]['name'] . "/" . $result[$i]['images'][0]['file']);
                $imgURL = str_replace(".jpg", "thumb.jpg", $imgURL);
                echo "
                    <meta property='og:url' content='http://www.homeluxe.in/browse.php?style=" . $myStyle . "&token=" . $randomString . "'/>
                    <meta property='og:type' content='website'/>
                    <meta property='og:title' content='" . $result[$i]['name'] . "' | HomeLuxe.in'/>
                    <meta property='og:description' content='" . $result[$i]['description'] . "'/>
                    <meta property='og:image' content='" . $imgURL . "'/>
                    <meta property='og:image:type' content='image/jpeg' /> 
                    <meta property='og:image:width' content='400' /> 
                    <meta property='og:image:height' content='300' />
                ";

                echo "<script>myRandomToken = '" . $randomString . "';</script>";
            }
        }

    } else {

        $randomString = generateRandomString();

        echo '
           <meta property="og:url" content="http://homeluxe.in/browse.php?token=' . $randomString . '"/>
           <meta property="og:type" content="website"/>
           <meta property="og:title" content="Browse Styles | HomeLuxe.in"/>
           <meta property="og:description" content="HomeLuxe.in combines an interactive design discovery platform with a complete implementation service to create your -wow- home!"/>
           <meta property="og:image" content="http://homeluxe.in/images/MENU.png"/>
           <meta property="og:image:type" content="image/jpeg" /> 
           <meta property="og:image:width" content="400" /> 
           <meta property="og:image:height" content="300" />
        ';

        echo "<script>myRandomToken = '" . $randomString . "';</script>";
    }

    ?>



    <link rel="stylesheet" href="default.css" type="text/css">
    <link rel="stylesheet" href="animate.css" type="text/css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="fontAwesome/css/font-awesome.css"/>

    <meta charset="UTF-8">
    <title>Browse Styles | HomeLuxe</title>

    <script src="jquery.min.js"></script>

    <script type="text/javascript" src="jquery.adaptive-backgrounds.js"></script>


    <div id="fb-root"></div>
    <script>
        window.fbAsyncInit = function () {
            FB.init({
                appId: '607233152758333',
                status: true,
                cookie: true,
                xfbml: true
            });
        };
        (function () {
            var e = document.createElement('script');
            e.async = true;
            e.src = document.location.protocol +
                '//connect.facebook.net/en_US/all.js';
            document.getElementById('fb-root').appendChild(e);
        }());


    </script>

    <script type="text/javascript">


        var images = [];
        var currentImage = 0;
        var currentStyle;


        $(document).ready(function () {
            $('.facebookStyle').click(function (e) {
                e.preventDefault();
                FB.ui(
                    {
                        method: 'feed',
                        name: styles[currentStyle].name+' on HomeLuxe.in',
                        link: window.location.href,
                        picture: 'http://www.homeluxe.in/images/styles/' + styles[currentStyle].name + '/' + styles[currentStyle].images[0].file,
                        caption: 'This style is available on HomeLuxe.in',
                        description: styles[currentStyle].description,
                        message: 'Check out this style. It looks absolutely beautiful! :)'
                    });
            });
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

        function viewStyle(styleNum) {
            currentStyle = styleNum;
            $('.resultCard').fadeIn(500);
            $('.centerDesc').fadeIn(500);


            changeUrlParam('style', styles[styleNum].catalogueKey);
            changeUrlParam('token', myRandomToken);

            console.log("CALLED");

            images = [];

            console.log("BEFORE: " + images);

            if (styles[styleNum].images.length != 0) {
                for (var i = 0; i < styles[styleNum].images.length; i++) {
                    images[i] = styles[styleNum].name + '/' + styles[styleNum].images[i].file;
                }
                console.log(images);
                console.log("url('images/styles/" + styles[styleNum].name + '/' + styles[styleNum].images[0].file + "') no-repeat;");
                $(".styleContainer").css("background", "url('images/styles/" + images[currentImage] + "')");
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

        function imgError(image) {
            image.onerror = "";
            image.src = "images/NOIMAGE.png";
            return true;
        }

        $(document).ready(function () {


            $('.browseLooks').click(function () {
                $('.resultCard').fadeOut(500);
            });

            $('.hideInfo').click(function () {
                $('.centerDesc').fadeOut(500);
            });

            $('.callDesigner').click(function () {
                window.location = 'index.html#contactUsX';
            });


            $('.leftNav').click(function () {
                console.log("Current" + currentImage);
                currentImage -= 1;
                if (currentImage < 0) {
                    currentImage = images.length - 1;
                }
                console.log("LEFT" + currentImage);
                $(".styleContainer").css("background", "url('images/styles/" + images[currentImage] + "')");
                $(".styleContainer").css("background-size", "contain");
                $(".styleContainer").css("background-repeat", "no-repeat");
                $(".styleContainer").css("background-position", "center");
                //$.adaptiveBackground.run();
            });

            $('.rightNav').click(function () {
                console.log("Current" + currentImage);
                currentImage++;
                currentImage = (currentImage) % images.length;
                console.log("RIGHT " + currentImage);
                $(".styleContainer").css("background", "url('images/styles/" + images[currentImage] + "')");
                $(".styleContainer").css("background-size", "contain");
                $(".styleContainer").css("background-repeat", "no-repeat");
                $(".styleContainer").css("background-position", "center");
                //$.adaptiveBackground.run();
            });

            $('.howItWorksButton').click(function () {
                window.location = 'index.html#howItWorksX';
            });
            $('.whoWeAreButton').click(function () {
                window.location = 'index.html#whoWeAreX';
            });
            $('.contactUsButton').click(function () {
                window.location = 'index.html#contactUsX';
            });
            $('.logoButton').click(function () {
                window.location = 'index.html';
            });

            $('.homeButton').click(function () {
                 window.location = 'index.html';
            });

            $('.resultLogo').click(function () {
                 window.location = 'index.html';
            });

            $('.browseOurStylesButton').click(function () {
                window.location = 'browse.php';
            });

            $('.findYourStyleButton').click(function () {
                window.location = 'quiz.html';
            });

            var menuState = false;
            var loginPanelState = false;

            $(".menuTrigger").click(function () {
                if (!menuState)
                    menuOpen();
                else
                    menuClose();
            });

            $(".loginButton").click(function () {
                window.location = "http://homeluxe.in/accounts"
//                if (!loginPanelState)
//                    loginPanelOpen();
//                else
//                    loginPanelClose();
            });

            $(".menuContainer").click(function () {
                if (menuState) {
                    menuClose();
                }
            });

            $(".loginPanel").click(function () {
                if (loginPanelState) {
                    loginPanelClose();
                }
            });


            function loginPanelClose() {
                loginPanelState = false;
                $(".loginPanel").stop(true, true).fadeOut(350);
            }

            function loginPanelOpen() {
                loginPanelState = true;
                $(".loginPanel").stop(true, true).fadeIn(350);
            }

            $(".loginPanel").on('click', function (e) {
                if (e.target !== this)
                    return;
                loginPanelClose();
            });


            function menuClose() {
                menuState = false;

                $(".menuCloseFeedback").stop(true, true).animate({opacity: 0}, 500);
                $(".menuContainer").stop(true, true).fadeOut(350);
                $(".menu").stop(true, true).animate({left: '-270px'}, 350);
                $("#fullpage").stop(true, true).animate({left: '0px'}, 350);
            }

            function menuOpen() {
                menuState = true;
                $(".menuCloseFeedback").stop(true, true).animate({opacity: 1}, 500);
                $(".menuContainer").stop(true, true).fadeIn(350);
                $(".menu").stop(true, true).animate({left: '0px'}, 350);
                $("#fullpage").stop(true, true).animate({left: '100px'}, 350);
            }

            function getToken() {
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: "http://homeluxe.in:3000/getToken",
                    success: function (data) {

                        if (data.success == true) {
                            console.log("TOKEN: " + data.token);
                            myToken = data.token;
                            getStyles();
                        } else {
                            console.log("ERROR RECEIVING TOKEN");
                        }

                    }
                });
            }

            getToken();

            function getStyles() {
                $.ajax({
                    type: "POST",
                    contentType: "application/x-www-form-urlencoded",
                    data: {
                        'token': myToken,
                    },
                    url: "http://homeluxe.in:3000/browse",
                    success: function (data) {
                        console.log(data);
                        console.log(data.length);
                        styles = data;

                        $.each(styles, function (index, item) {

                            if (item.images[0].name != 'NOIMAGE.png') {

                                $('.diamondContainer').append("<div class='diamond' id='styleDia" + index + "'><a href='javascript:viewStyle(" + index + ");'><div  data-adaptive-background data-ab-css-background data-ab-parent='#styleDia" + index + "' class='diamondText' id='style" + index + "' ><div class='textHighlight'>" + item.name + "</div></div></a></div>");

                                var str = item.images[0].file;
                                var res = str.split(".");

                                $("#style" + index).css("background", "url('images/styles/" + item.name + "/" + res[0] + "thumb." + res[1] + "')");
                                $("#style" + index).css("background-size", "auto 160%");
                                $("#style" + index).css("background-repeat", "no-repeat");
                                $("#style" + index).css("background-position", "center");

                            } else {
                                $('.diamondContainer').append("<div class='diamond'><a href='javascript:viewStyle(" + index + ");'><div  class='diamondText' id='style" + index + "' ><div class='textHighlight'>" + item.name + "</div></div></a></div>");
                                $("#style" + index).css("background", "url('images/styles/" + item.name + "/" + item.images[0].file + "')");
                                $("#style" + index).css("background-size", "auto 100%");
                                $("#style" + index).css("background-repeat", "no-repeat");
                                $("#style" + index).css("background-position", "center");
                            }
                        });
                        $('.mainCard').fadeIn(1000);
                        $('.mainCard').animate({marginTop: '0px'}, 500, function () {
                            setTimeout(function () {
                                //$.adaptiveBackground.run();
                            }, 2000);
                        });

                        if (urlStyle != null) {
                            var styleNumber;
                            for (var i = 0; i < styles.length; i++) {
                                if (styles[i].catalogueKey == urlStyle) {
                                    styleNumber = i;
                                }
                            }
                            viewStyle(styleNumber);
                        }
                    }
                });


            }
        });
        var styles = [];
        var myToken;
    </script>

    <style>

        @font-face {
            font-family: SergoeLight;
            src: url('fonts/SergoeLight.ttf');
        }

        @font-face {
            font-family: RobotoLight;
            src: url('fonts/roboto/Roboto-Light.ttf');
        }

        @font-face {
            font-family: RobotoMedium;
            src: url('fonts/roboto/Roboto-Medium.ttf');
        }

        @font-face {
            font-family: RobotoRegular;
            src: url('fonts/roboto/Roboto-Regular.ttf');
        }

        html, body {
            -webkit-touch-callout: none; /* iOS Safari */
            -webkit-user-select: none; /* Chrome/Safari/Opera */
            -khtml-user-select: none; /* Konqueror */
            -moz-user-select: none; /* Firefox */
            -ms-user-select: none; /* IE/Edge */
            user-select: none;
            width: 100% !important;
            height: 100%;
            max-width: 100% !important;
            outline: none;
            padding: 0;
            border: 0;
            margin: 0;
            min-width: 1000px;
            background: url('images/artwork.png') #E9E9EB;
            background-size: 1000px 1000px;
            font-family: RobotoRegular;
            color: #333;
            font-size: 20px;
        }

        .actionButton {
            display: inline-block;
            background: #468FDE;
            color: #FFF;
            font-size: 20px;
            padding: 18px 30px 18px 30px;
            margin-top: 50px;
            box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.2);
            cursor: pointer;
        }

        .hideInfo {
            background: transparent;
            color: #6699ff;
            font-size: 20px;
            margin-top: 40px;
            box-shadow: none;
            border: 1px solid #6699ff;
        }

        .footer {
            position: fixed;
            width: 100%;
            bottom: 0;
            height: 20px;
            z-index: 100;
            background: #CCC;
        }

        .quizProgress {
            width: 0px;
            height: 100%;
            float: left;
            transition: all ease .5s;
            background: yellowgreen;
        }

        .resultCard {
            display: none;
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            background: #EEE;
            text-align: center;
        }

        .leftPanel {
            height: 100%;
            width: 300px;
            background: #333;
            color: #EEE;
            float: left;
        }

        .panelTitle {
            font-size: 25px;
            margin-top: 30px;
            text-align: center;
            width: 100%;
            color: #EEE;
        }

        .introPanel {
            height: 100%;
            width: 100%;
            padding: 20px;
            box-sizing: border-box;
            float: left;
            text-align: center;
            overflow-y: hidden;
            overflow-x: auto;
        }

        .mainCard {
            display: none;
            margin: 0 auto;
            width: 90%;
            height: 100%;
            overflow: hidden;
            background: rgba(255, 255, 255, .3);
            margin-top: 1000px;
            transition: all ease .5s;
        }

        .headerSpacer {
            height: 100%;
            width: 300px;
        }

        .spacerLeft {
            float: left;
        }

        .spacerRight {
            float: right;
        }

    </style>
</head>

<body>


<div class="header">

    <div class="headerSpacer spacerLeft">

        <div class="menuBox menuTrigger">
            <i class="fa fa-caret-left menuButton menuCloseFeedback" style="margin-right: 5px; opacity: 0;"></i>

            <img src="images/MENU.png" style="height: 30px; width: 30px; float: left; margin-top: 15px;">
            <div class="menuTriggerText">
                MENU
            </div>
        </div>
    </div>


    <img class='logoButton' src="images/logo.png">

    <div class="headerSpacer spacerRight ">
        <div class="menuBox menuLogin hideMobile loginButton">
            <div class="menuTriggerText">
                LOGIN/SIGNUP
            </div>
        </div>
        <div class="menuBox hideMobile menuLogin" style="text-align: center; padding-left: 0px; padding-right: 0px;">
            <div class="skewMe" style=" height: 100%;
            width: 80px; background: #878787 ;
            opacity: 0.1;
             transform: skew(-30deg, 0deg);  position: absolute; margin-left: 30px;"></div>
            <div class="menuTriggerText boxMe contactUsButton"
                 style="position: relative; z-index: 100; font-family: RobotoRegular;">
                CONTACT US
            </div>
        </div>
    </div>


</div>

<div class="menuContainer">

</div>

<div class="menu">
    <div class="menuOption homeButton">Home</div>
    <div class="menuOption findYourStyleButton">Find Your Style</div>
    <div class="menuOption browseOurStylesButton">Browse Our Styles</div>
    <div class="menuOption howItWorksButton">How It Works</div>
    <div class="menuOption whoWeAreButton">Who We Are</div>
    <div class="menuOption contactUsButton">Contact Us</div>
</div>


<div class="loginPanel">
    <div class="loginContainer">
        <div class="loginSelect">LOGIN</div>
        <div class="loginSelect" style="font-size: 17px; margin-top: 15px; margin-bottom: 15px; ">Sign in to see
            information about your project and to communicate with us.<br><br><br><br><b>COMING SOON!</b>
        </div>

        <div class="loginTab" style='display: none;'>
            <input type='text' class="loginInput" placeholder="EMAIL ADDRESS">
            <input type='password' class="loginInput" placeholder="PASSWORD">

            <div class="getStartedButton" style="">SIGN IN
            </div>
        </div>
    </div>
</div>

<style>

    .styleContainer {
        width: 100%;
        overflow: hidden;
        height: 100%;
    }

    .stylesList {
        width: 95%;
        margin: 0 auto;
        margin-top: 20px;
        text-align: center;
        height: 500px;
        overflow-y: auto;
    }

    .listItem {
        width: 90%;
        display: inline-block;
        padding: 17px 10px 17px 10px;
        background: rgba(0, 0, 0, 0.03);
        margin: 0 auto;
        font-size: 18px;
        font-family: RobotoLight;
        color: #888;
        box-sizing: border-box;
        cursor: pointer;
        transition: all ease .2s
    }

    .aligner {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
    }

    .listItem:hover {
        background: rgba(0, 0, 0, 0.1);
    }

    .headerBar {
        width: 100%;
        height: 70px;
        background: rgba(255, 255, 255, 0.90);
        float: top;
        transition: all ease .2s;
    }

    .headerBar:hover {
        background: rgba(255, 255, 255, .97);
    }

    .shareStyle {
        float: left;
        font-size: 30px;
        margin-top: 20px;
        margin-left: 20px;
        float: left;
        opacity: .8;
        transition: all ease .3s;
    }

    .shareStyle:hover {
        opacity: 1;
        text-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
    }

    .loveStyle {
        color: darkred !important;
    }

    .facebookStyle {
        color: darkslateblue !important;
    }

    .pinterestStyle {
        color: indianred !important;
    }

    .instaStyle {
        color: #333 !important;
    }

    .styleContainer {
        width: 100%;
        overflow: hidden;
        height: 100%;
    }


    .imageNav {
        width: 100%;
        height: calc(100% - 140px);
        background: rgba(0, 0, 0, 0.05);
        float: top;
    }

    .optionBar {
        width: 100%;
        height: 140px;
        float: top;
        background: rgba(255, 255, 255, 0.90);
        transition: all ease .2s;
    }

    .optionBar:hover {
        background: rgba(255, 255, 255, 0.97);
    }

    .browseLooks {
        display: inline-block;
        cursor: pointer;
        color: #FFF;
        box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.2);
        margin-top: 14px;
        float: right;
        margin-right: 12px;
        font-size: 18px;
        padding: 12px 20px 12px 20px;
    }

    .callDesigner {
        display: inline-block;
        cursor: pointer;
        color: #FFF;
        box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.2);
        margin-top: 14px;
        float: right;
        margin-right: 12px;
        font-size: 18px;
        padding: 12px 20px 12px 20px;
        background: yellowgreen;

    }

    .leftNav {
        width: 100px;
        height: 100%;
        float: left;
        text-align: center;
    }

    .rightNav {
        width: 100px;
        height: 100%;
        float: right;
        text-align: center;
    }

    .titleStyle {
        font-size: 30px;
        margin-top: 35px;
        font-family: RobotoLight;
    }

    .descStyle {
        width: 100%;
        font-size: 20px;
        margin-top: 30px;
        font-family: RobotoLight;
        color: #555;
    }

    .resultLogo {
        height: 40px;
        margin-top: 15px;
        float: left;
        margin-left: 70px;
        cursor: pointer;
    }

    .centerDesc {
        width: calc(100% - 200px);
        height: 100%;
        float: left;
        text-align: center;
    }

    .navAngles {
        font-size: 100px;
        margin: 0 auto;
        color: rgba(0, 0, 0, .65);
        transition: all ease .3s;
        text-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
    }

    .navAngles:hover {
        color: rgba(255, 255, 255, 1);
    }

    .styleDescBox {
        display: table;
        width: 100%;
        height: 100%;
        padding: 30px 100px 30px 100px;
        box-sizing: border-box;
        background: rgba(255, 255, 255, 0.95);
        margin: 0 auto;
    }

    /* DIAMOND SHAPES */

    .diamondContainer {
        width: 900px;
        margin: 0 auto;
        text-align: center;
    }

    .diamond:hover {
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
        border: 4px solid yellowgreen;
        position: relative;
        z-index: 9999;
    }

    .diamond {
        cursor: pointer;
        height: 200px;
        width: 200px;
        float: left;
        display: inline-block;
        overflow: hidden;
        margin-left: 41px;
        margin-right: 40px;
        margin-top: 41px;
        background: #DDD;
        border: 4px solid #fff;
        text-decoration: none;
        color: #fff;

        transition: all ease .2s;

        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        transform: rotate(45deg);
    }

    .diamondText {
        width: 200px;
        height: 200px;
        display: table-cell;
        vertical-align: middle;

        text-align: center;
        font-family: 'Open Sans', sans-serif;
        font-size: 13px;
        text-transform: uppercase;
        -webkit-transform: rotate(-45deg);
        -moz-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
        -o-transform: rotate(-45deg);
        transform: rotate(-45deg);
    }

    @media only screen and (min-device-width: 800px) {
        .diamondContainer > div:nth-child(5n+4) {
            margin-left: 186px;
        }

        .diamondContainer > div:nth-child(n+4) {
            margin-top: -64px;
        }
    }

    .clear::after {
        content: '';
        display: table;
        clear: both;
    }

    .textHighlight {
        display: inline-block;
        padding: 10px;
        background: white;
        color: #000;
    }

    /* DIAMOND SHAPES */

    .viewInfo {

        height: 45px;
        float: left;
        margin-top: 12.5px;
        margin-left: 20px;
        display: inline-block;
        padding: 12px 5px 12px 5px;
        font-family: RobotoLight;
        font-size: 18px;
        box-sizing: border-box;
        text-transform: uppercase;
        color: #000;
    }

    .textHighlight {
        display: inline-block;
        padding: 5px;
        background: white;
        color: #000;
    }

    .mainCardContainer {
        padding-top: 60px;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        display: table;
    }

    .diamondText {
        width: 200px;
        height: 200px;
        display: table-cell;
        vertical-align: middle;

        text-align: center;
        font-family: 'Open Sans', sans-serif;
        font-size: 13px;
        text-transform: uppercase;
        -webkit-transform: rotate(-45deg);
        -moz-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
        -o-transform: rotate(-45deg);
        transform: rotate(-45deg);
    }

    .logoButton {
        margin: 0 auto;
        margin-top: 12.5px;
        height: 35px;
        cursor: pointer;
    }

    @media only screen and (max-width: 800px) {
        html, body {
            width: 100%;
            height: 100%;
            min-width: 300px;
            overflow-y: auto;
            overflow-x: auto;
        }

        .diamondContainer {
            width: 290px;
            margin: 0 auto;
            text-align: center;

        }

        .diamond {
            cursor: pointer;
            height: 100px;
            width: 100px;
            float: left;
            display: inline-block;
            overflow: hidden;
            margin-left: 20.5px;
            margin-right: 20px;
            margin-top: 20.5px;
            background: #DDD;
            border: 2px solid #fff;
            text-decoration: none;
            color: #fff;

            transition: all ease .2s;

            -webkit-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            -o-transform: rotate(45deg);
            transform: rotate(45deg);
        }

        .introPanel {
            padding: 0px;
        }

        .diamondContainer > div:nth-child(3n+3) {
            margin-left: 93px;
        }

        .diamondContainer > div:nth-child(n+3) {
            margin-top: -32px;
        }

        .diamondText {
            width: 100px;
            height: 100px;
            font-size: 10px;
        }

        .hideMobile {
            display: none;
        }

        .viewInfo {

            height: 35px;
            float: left;
            margin-top: 17.5px;
            margin-left: 10px;
            display: inline-block;
            padding: 10px 2px 10px 2px;
            font-family: RobotoLight;
            font-size: 13px;
            box-sizing: border-box;
            text-transform: uppercase;
            color: #000;
        }

        .descStyle {
            font-size: 17px;
            margin-top: 13px;
            font-family: RobotoLight;
            color: #555;
        }

        .titleStyle {
            font-size: 20px;
            margin-top: 0px;
            font-family: RobotoLight;
        }

        .logoButton {
            height: 25px;
            margin-top: 19.5px;
        }

        .hideInfo {
            font-size: 15px;
            padding: 5px;
            margin-top: 15px;
        }

        .resultLogo {
            height: 25px;
            margin-top: 22.5px;
            float: left;
            margin-left: 10px;
        }

        .styleDescBox {
            height: 100%;
            display: table;
            width: 100%;
            padding: 20px 10px 10px 10px;
            box-sizing: border-box;
            background: rgba(255, 255, 255, 0.95);
            margin: 0 auto;
        }

        .leftNav {
            width: 50px;
            background: rgba(0, 0, 0, 0.1);
        }

        .rightNav {
            width: 50px;

            background: rgba(0, 0, 0, 0.1);
        }

        .navAngles {
            font-size: 50px;
        }

        .optionBar {
            height: 80px;
        }

        .imageNav {
            height: calc(100% - 150px);
        }

        .shareStyle {
            float: left;
            font-size: 20px;
            margin-top: 10px;
            margin-left: 10px;
            float: left;
            opacity: .8;
            transition: all ease .3s;
        }

        .centerDesc {
            width: calc(100% - 100px);
            height: 100%;
            float: left;
            text-align: center;
        }

        .logoButton {
            float: left;
            margin-left: 10px;
        }

        .iconContainer {
            width: 100%;
            display: inline-block;
        }

        .browseLooks {
            margin-top: 5px;
            float: left;
            margin-left: 5px;
            font-size: 14px;
            padding: 8px 5px 8px 5px;
        }

        .callDesigner {
            margin-top: 5px;
            float: right;
            margin-right: 5px;
            font-size: 14px;
            padding: 8px 5px 8px 5px;
        }

        .headerSpacer {
            width: 150px;
        }

        .mainCard {
            width: 100%;
            height: 100%;
            text-align: center;

        }
    }

    @media only screen
    and (min-device-width: 1600px)
    and (max-device-width: 1920px) {
        .descStyle {
            padding: 50px 300px 50px 300px;
            box-sizing: border-box;
        }

        .viewStyleTitle {
            font-size: 40px;
        }
    }
</style>


<div class="mainCardContainer">
    <div class="mainCard">
        <div class="introPanel" style="width: 100%;">
            <div class="diamondContainer clear"></div>
        </div>
    </div>
</div>


<div class="resultCard">
    <div class="styleContainer">
        <div class="headerBar">
            <img src="images/logo.png" class="resultLogo">
            <div class="viewInfo">
                <span class="viewStyleTitle2"></span>
            </div>
        </div>
        <div class="imageNav">
            <div class="leftNav">
                <div style="height:calc((100% - 100px)/2); width:100%;"></div>
                <i class="fa fa-angle-left navAngles"></i>
            </div>

            <div class="centerDesc">
                <div class="styleDescBox">
                    <span class="aligner">
                        <div class="titleStyle viewStyleTitle"></div>
                        <div class="descStyle viewStyleDesc">Style Title Text Goes Here</div>
                        <div class="actionButton hideInfo">HIDE</div>
                    </span>
                </div>

            </div>
            <div class="rightNav">
                <div style="height:calc((100% - 100px)/2); width:100%;"></div>
                <i class="fa fa-angle-right navAngles"></i>
            </div>
        </div>
        <div class="optionBar">
            <div class="iconContainer">
                <i class="fa fa-heart shareStyle loveStyle"></i>
                <i class="fa fa-pinterest-square shareStyle pinterestStyle"></i>
                <i class="fa fa-facebook-square shareStyle facebookStyle"></i>
            </div>

            <div class="actionButton browseLooks ">BROWSE OTHER LOOKS</div>

            <div class="actionButton callDesigner ">CALL A DESIGNER</div>

        </div>
    </div>

</div>


</body>
</html>