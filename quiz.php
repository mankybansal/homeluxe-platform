<?php

include("session.php");

?>

<!DOCTYPE html>
<html lang="en">
<head>

    <meta name=viewport content="width=device-width, initial-scale=1">


    <link rel="stylesheet" href="default.css" type="text/css">
    <link rel="stylesheet" href="animate.css" type="text/css">
    <link rel="stylesheet" href="headerMenu.css" type="text/css">
    <link rel="stylesheet" href="accountsDefault.css" type="text/css">
    <link rel="stylesheet" href="styleViewer.css" type="text/css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="fontAwesome/css/font-awesome.css"/>
    <link rel="stylesheet" href="styleViewer.css" type="text/css">

    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>


    <meta charset="UTF-8">
    <title>HomeLuxe | Style Quiz - Find Your Style</title>

    <script src="jquery.min.js"></script>
    <script type="text/javascript" src="jquery.adaptive-backgrounds.js"></script>
    <script type="text/javascript" src="jquery.cookie.js"></script>
    <script type="text/javascript" src="accounts.js"></script>
    <script type="text/javascript" src="headerMenu.js"></script>
    <script type="text/javascript" src="styleViewer.js"></script>


    <script type="text/javascript">
        $(document).ready(function () {

            $('.continueButton').click(function () {
                $('.introPanel').fadeOut(500);
                $('.questionCard').fadeIn(500);
                $('.questionCard').animate({marginTop: '0px'}, 500);
            });

            $('.option').click(function () {
                var myID = this.id;
                var optionNumber = myID.substr(6, 1);
                saveAnswers(questionSet[currentQuestion].options[optionNumber].optionID);
                loadQuestion();
            });

            var answer_set = new Array();

            function saveAnswers(ID) {
                answer_set.push(ID);
            }

            function loadQuestion() {
                myProgress += 14.28;
                $('.quizProgress').css('width', myProgress + '%');
                if (currentQuestion + 1 < 6) {
                    var newQuestion = questionSet[++currentQuestion].question;
                    $('#questionText').text(newQuestion);
                    $('#option1-text').text(questionSet[currentQuestion].options[0].optionText);
                    $('#option1-img').html("<img  onerror='imgError(this);' src='images/optionPictures/" + questionSet[currentQuestion].images[0] + "' class='optionImage'>");
                    $('#option2-text').text(questionSet[currentQuestion].options[1].optionText);
                    $('#option2-img').html("<img onerror='imgError(this);' src='images/optionPictures/" + questionSet[currentQuestion].images[1] + "' class='optionImage'>");
                    $('#option3-text').text(questionSet[currentQuestion].options[2].optionText);
                    $('#option3-img').html("<img onerror='imgError(this);' src='images/optionPictures/" + questionSet[currentQuestion].images[2] + "' class='optionImage'>");
                    $('#option4-text').text(questionSet[currentQuestion].options[3].optionText);
                    $('#option4-img').html("<img onerror='imgError(this);' src='images/optionPictures/" + questionSet[currentQuestion].images[3] + "' class='optionImage'>");
                } else {
                    stopQuestions();
                }
            }

            getToken();

            function getToken() {
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: "http://homeluxe.in:3000/getToken",
                    success: function (data) {

                        if (data.success == true) {
                            console.log("TOKEN: " + data.token);
                            quizToken = data.token;
                            getQuestions();
                        } else {
                            console.log("ERROR RECEIVING TOKEN");
                        }

                    }
                });
            }

            function getQuestions() {
                $.ajax({
                    type: "POST",
                    contentType: "application/x-www-form-urlencoded",
                    data: {
                        'submit': 0,
                        'token': quizToken
                    },
                    url: "http://homeluxe.in:3000/quiz",
                    success: function (data) {
                        $.each(data, function (i, item) {
                            questionSet[i] = {
                                "questionID": item.Questions.id,
                                "question": item.Questions.name,
                                "options": [
                                    {
                                        'optionID': item.Options[0].id,
                                        'optionText': item.Options[0].name
                                    },
                                    {
                                        'optionID': item.Options[1].id,
                                        'optionText': item.Options[1].name
                                    },
                                    {
                                        'optionID': item.Options[2].id,
                                        'optionText': item.Options[2].name
                                    },
                                    {
                                        'optionID': item.Options[3].id,
                                        'optionText': item.Options[3].name
                                    }
                                ],
                                "images": [
                                    item.Options[0].image,
                                    item.Options[1].image,
                                    item.Options[2].image,
                                    item.Options[3].image
                                ]
                            };
                        });
                        console.log(questionSet);
                        loadQuestion();
                    }

                });
            }

            function stopQuestions() {
                $('.questionCard').fadeOut(500);
                $('.questionCard').animate({marginTop: '1000px'}, 500);
                $('.resultCard').delay(500).fadeIn(1000);

                $.cookie('myAnswers', answer_set, {expires: 30, path: '/'});

                $.ajax({
                    type: "POST",
                    contentType: "application/x-www-form-urlencoded",
                    data: {
                        'submit': 1,
                        'token': quizToken,
                        'answer_set': answer_set.join()
                    },
                    url: "http://homeluxe.in:3000/quiz",
                    success: function (data) {
                        console.log(data);
                        styles = data;
                        console.log(styles);
                        viewStyle(0);

                    }
                });


            }
        });

        var styles = [];
        var currentQuestion = -1;
        var myProgress = 0;
        var questionSet = [];
        var quizToken;
    </script>

    <style>

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
            overflow: hidden !important;
            font-family: RobotoRegular;
            color: #333;
            font-size: 20px;
        }

        .sectionPanel {
            display: none;
            width: 100%;
            height: 100%;
        }

        .introTitle {
            width: 100%;
            text-align: center;
            font-size: 40px;
        }

        .questionCardContainer {
            padding-top: 60px;
            padding-bottom: 20px;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            display: table;
        }

        .introSubTitle {
            width: 100%;
            color: #666;
            text-align: center;
            font-size: 20px;
            margin-top: 10px;
        }

        .introPanel {
            text-align: center;
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

        .questionText {
            font-size: 35px;
            color: #666;
            font-family: RobotoLight;
            width: 100%;
            padding: 0px 15px 0px 15px;
            width: 100%;
            text-align: center;
            box-sizing: border-box;
        }

        .optionImage {
            height: 100%;
            width: auto;
        }

        .option:hover {
            background: rgba(0, 0, 0, 0.05);
            box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.05);
        }

        .questionCard {
            display: none;
            margin: 0 auto;
            width: 90%;
            height: 95%;
            box-shadow: 0px 0px 100px rgba(0, 0, 0, 0.1);
            background: white;
            margin-top: 1000px;
            box-sizing: border-box;
            padding: 80px 60px 0px 60px;
            transition: all ease .5s;
            overflow-y: auto;
        }

        .questionOptions {
            width: 100%;
            display: inline-block;
            text-align: center;
            margin-top: 50px;
        }

        .aligner {
            display: table-cell;
            vertical-align: middle;
            text-align: center;
        }

        .option {
            display: inline-block;
            vertical-align: middle;
            margin: 15px;
            width: 200px;
            height: 260px;
            background: rgba(0, 0, 0, 0.1);
            transition: all ease .5s;
            cursor: pointer;
        }

        .optionImageContainer {
            width: 200px;
            height: 200px;
            background: rgba(0, 0, 0, 0.1);
            overflow: hidden !important;
        }

        .optionText {
            float: top;
            width: 100%;
            height: 60px;
            box-sizing: border-box;
            padding: 17px 5px 5px 5px;

        }

        @media only screen and (max-width: 800px) {
            html, body {
                width: 100%;
                height: 100%;
                min-width: 300px;
                overflow-y: auto;
            }

            .optionText {
                padding: 5px 5px 5px 5px;
                font-size: 3vw;
                height: 20px !important;
            }

            .questionText {
                font-size: 6vw;
            }

            .option {
                display: inline-block;
                vertical-align: middle;
                margin: 5px;
                width: 100px;
                height: 140px;
                background: rgba(0, 0, 0, 0.1);
                transition: all ease .5s;
                cursor: pointer;
            }

            .questionOptions {
                width: 100%;
                display: inline-block;
                text-align: center;
                margin-top: 20px;
            }

            .optionImageContainer {
                width: 100px;
                height: 100px;
                background: rgba(0, 0, 0, 0.1);
                overflow: hidden !important;
            }

            .introTitle {
                width: 90%;
                margin: 0 auto;
                font-size: 23px;
            }

            .introSubTitle {
                width: 70%;
                margin: 0 auto;
                font-size: 18px;
                font-family: RobotoLight;
            }

            .questionCard {

                width: 90%;
                display: inline-block;
                height: auto;
                box-shadow: 0px 0px 100px rgba(0, 0, 0, 0.1);
                background: white;
                overflow-y: auto;
                margin-top: 1000px;
                box-sizing: border-box;
                padding: 40px 20px 40px 20px;
                transition: all ease .5s;
            }
        }

        @media only screen
        and (min-device-width: 768px)
        and (max-device-width: 1024px) {
            html, body {
                width: 100%;
                height: 100%;
                min-width: 600px;
                overflow-y: auto;
            }

            .questionCard {
                height: 70%;
                padding: 100px 0px 20px;
            }

            .questionOptions {
                margin-top: 50px;
            }

            .option {
                width: 150px;
                height: 210px;
            }

            .optionImageContainer {
                height: 150px;
                width: 150px;
            }

            .optionText {
                font-size: 18px;
            }
        }

        @media only screen
        and (min-device-width: 1600px)
        and (max-device-width: 1920px) {

            .questionOptions {
                margin-top: 100px;
            }

            .option {
                width: 200px;
                height: 260px;
            }

            .optionImageContainer {
                height: 200px;
                width: 200px;
            }

            .optionText {
                font-size: 20px;
            }

            .questionText {
                margin-top: 100px;
            }

        }
    </style>

</head>

<body>

<div class="headerMenu"></div>
<div class="loginOverlay"></div>

<div class="introPanel sectionPanel" style="width: 100%; height: 100%;   padding-top: 60px;
            padding-bottom: 20px;
            box-sizing: border-box; display: table;">
    <span class="aligner">
    <div class="introTitle">Ready to find your style?</div>
    <div class="introSubTitle">
        We'll be asking you a few simple questions.
        <br>
        All you have to do is pick an option that suits you the most.
    </div>

    <div class="continueButton actionButton">CONTINUE</div>
    </span>
</div>

<div class="styleViewer"></div>

<div class="questionCardContainer">
    <span class="aligner">
    <div class="questionCard">
        <div class="questionText">
            <span id="questionText"></span>
        </div>

        <div class="questionOptions">
            <div class="option animated fadeInUp" id="option0">
                <div class="optionImageContainer" id="option1-img">

                </div>
                <div class="optionText" id="option1-text"></div>
            </div>
            <div class="option animated fadeInUp" id="option1">
                <div class="optionImageContainer" id="option2-img">

                </div>
                <div class="optionText" id="option2-text"></div>
            </div>
            <div class="option animated fadeInUp" id="option2">
                <div class="optionImageContainer" id="option3-img">

                </div>
                <div class="optionText" id="option3-text"></div>
            </div>
            <div class="option animated fadeInUp" id="option3">
                <div class="optionImageContainer" id="option4-img">

                </div>
                <div class="optionText" id="option4-text"></div>
            </div>
        </div>
    </div>
    </span>
</div>

<div class="footer">
    <div class="quizProgress"></div>
</div>

</body>
</html>