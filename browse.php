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


    <link rel="stylesheet" href="bower_components/animate.css/animate.css" type="text/css">
    <link rel="stylesheet" href="bower_components/components-font-awesome/css/font-awesome.css">
    
    <link rel="stylesheet" href="css/default.css" type="text/css">
    <link rel="stylesheet" href="css/accountsDefault.css" type="text/css">
    <link rel="stylesheet" href="css/headerMenu.css" type="text/css">
    <link rel="stylesheet" href="css/styleViewer.css" type="text/css">

    <meta charset="UTF-8">
    <title>Browse Styles | HomeLuxe</title>


    <script src="/bower_components/jquery/dist/jquery.js"></script>
    <script src="/bower_components/angular/angular.js"></script>
    <script src="/bower_components/angular-route/angular-route.js"></script>
    <script src="/bower_components/js-cookie/src/js.cookie.js"></script>


    <script src="js/serverRequest.js"></script>
    <script src="js/app.js"></script>
    <script src="js/headerMenu.js"></script>
    <script src="js/styleViewer.js"></script>
    
    <script type="text/javascript">


        var styles = [];
        
        function getStyles() {
            requests.getStyles(function (response) {
                
                styles = response;

                $.each(styles, function (index, item) {

                    if (item.images[0].name != 'NOIMAGE.png') {
                        $('.diamondContainer').append("<div class='diamond' id='styleDia" + index + "'><a href='javascript:viewStyle(" + index + ");'><div  data-adaptive-background data-ab-css-background data-ab-parent='#styleDia" + index + "' class='diamondText' id='style" + index + "' ><div class='textHighlight'>" + item.name + "</div></div></a></div>");

                        var str = item.images[2].file;
                        var res = str.split(".");

                        $("#style" + index).css({
                            "background": "url('images/styles/" + item.name + "/" + res[0] + "thumb." + res[1] + "')",
                            "background-size": "auto 160%",
                            "background-repeat": "no-repeat",
                            "background-position": "center"
                        });
                    } else {
                        $('.diamondContainer').append("<div class='diamond'><a href='javascript:viewStyle(" + index + ");'><div  class='diamondText' id='style" + index + "' ><div class='textHighlight'>" + item.name + "</div></div></a></div>");
                        $("#style" + index).css({
                            "background": "url('images/styles/" + item.name + "/" + item.images[2].file + "')",
                            "background-size": "auto 100%",
                            "background-repeat": "no-repeat",
                            "background-position": "center"
                        });
                    }
                });
                
                $('.mainCard').fadeIn(1000).animate({marginTop: '0px'}, 500);

                if (urlStyle != null) {
                    var styleNumber;
                    for (var i = 0; i < styles.length; i++)
                        if (styles[i].catalogueKey == urlStyle)
                            styleNumber = i;
                    viewStyle(styleNumber);
                }
            });
        }

        $(document).ready(function () {
            $('.browseLooks').click(function () {
                $('.resultCard').fadeOut(500);
            });
            $('.resultLogo').click(function () {
                window.location = 'index.html';
            });
            getStyles();
        });
    </script>

    <style>

        html, body {
            -webkit-touch-callout: none; /* iOS Safari */
            -webkit-user-select: none; /* Chrome/Safari/Opera */
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
            font-family: RobotoRegular, sans-serif;
            color: #333;
            font-size: 20px;
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

        /* DIAMOND SHAPES */

        .diamondContainer {
            width: 900px;
            margin: 0 auto;
            text-align: center;
        }

        .diamond:hover {
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
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
                padding: 0;
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

            .mainCard {
                width: 100%;
                height: 100%;
                text-align: center;

            }
        }
    </style>


</head>

<body ng-app="homeluxeApp" ng-controller="userControl">

<header-menu></header-menu>
<login-overlay></login-overlay>
<style-viewer></style-viewer>

<div class="mainCardContainer">
    <div class="mainCard">
        <div class="introPanel" style="width: 100%;">
            <div class="diamondContainer clear"></div>
        </div>
    </div>
</div>

</body>
</html>