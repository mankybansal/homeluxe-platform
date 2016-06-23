<?php

include("../session.php");

?>

<!DOCTYPE html>
<html lang="en">
<head>

    <meta charset="UTF-8">


    <title>My HomeLuxe | HomeLuxe.in</title>
    <link rel="stylesheet" href="userPanel.css">
    <link rel="stylesheet" href="../fontAwesome/css/font-awesome.css">
    <script src="../jquery.min.js"></script>
    <script src="../jquery.cookie.js"></script>
    <script src="userPanel.js"></script>

</head>

<body>

<div class="mainUnderlay">

</div>

<div class="contentOverlay">

    <div class="menuLeft">


        <div class="menuOptionGroup">
            <a href="http://homeluxe.in"><img src="../images/logoWhite.png" class="menuHeaderLogo"></a>
        </div>

        <div class="menuOptionGroup">
            <div class="menuGroupLabel">Main</div>

            <div class="menuOption optionSelected">
                <div class="menuOptionSelect viewOverview"></div>
                <div class="menuOptionIcon">
                    <i class="fa fa-dashboard menuIcon"></i>
                </div>
                <div class="menuOptionText">Overview</div>
            </div>

            <div class="menuOption">
                <div class="menuOptionSelect viewMyLikes"></div>
                <div class="menuOptionIcon">
                    <i class="fa fa-thumbs-up menuIcon"></i>
                </div>
                <div class="menuOptionText">My Likes</div>
            </div>

            <div class="menuOption">
                <div class="menuOptionSelect viewQuiz"></div>
                <div class="menuOptionIcon">
                    <i class="fa fa-question-circle menuIcon"></i>
                </div>
                <div class="menuOptionText">Quiz Results</div>
            </div>

            <div class="menuOption">
                <div class="menuOptionSelect viewMyProfile"></div>
                <div class="menuOptionIcon">
                    <i class="fa fa-user menuIcon"></i>
                </div>
                <div class="menuOptionText">My Profile</div>
            </div>
        </div>

        <div class="menuOptionGroup">
            <div class="menuGroupLabel">Help & Settings</div>

            <div class="menuOption signOutButton">
                <div class="menuOptionSelect viewLogout"></div>
                <div class="menuOptionIcon">
                    <i class="fa fa-sign-out menuIcon"></i>
                </div>
                <div class="menuOptionText">Sign Out</div>
            </div>

            <div class="menuOption">
                <div class="menuOptionSelect viewHelp"></div>
                <div class="menuOptionIcon">
                    <i class="fa fa-question-circle menuIcon"></i>
                </div>
                <div class="menuOptionText">Help</div>
            </div>

            <div class="menuOption">
                <div class="menuOptionSelect viewReport"></div>
                <div class="menuOptionIcon">
                    <i class="fa fa-exclamation-circle menuIcon"></i>
                </div>
                <div class="menuOptionText">Report Error</div>
            </div>

            <div class="menuOption">
                <div class="menuOptionSelect viewSettings"></div>
                <div class="menuOptionIcon">
                    <i class="fa fa-gear menuIcon"></i>
                </div>
                <div class="menuOptionText">Settings</div>
            </div>
        </div>


    </div>


    <div class="mainContent">
        <div class="menuTop">

            <img src='../images/MENU.png' class="menuLogo">
            <div class="menuTitle">My HomeLuxe</div>
            <div class="menuSection">
                <i class="fa fa-angle-right"></i>&nbsp;<span class="menuGroupSelected">Main</span>
            </div>

            <div class="menuSection">
                <i class="fa fa-angle-right"></i>&nbsp;<span class="menuOptionSelected">Overview</span>
            </div>

            <div class="avatarBox">
            </div>

            <div class="profileBox">
                <span style="color: #999;">Welcome, </span>
                <span class='dataName' style="color: #333;"></span>
            </div>
        </div>
        <div class="fillContent">

            <div class="viewPanel viewSelected" id="viewOverview">

                <div class="statsBoxes">
                    <div class="statsTint tintBlue">
                        <div class="statsIcon">
                            <i class="fa fa-thumbs-up"></i>
                            <span class='dataLikeCount' style="color: rgba(0,0,0,0.2); margin-left: 10px; ">0</span>
                        </div>
                        <div class="statsTintText">Liked Styles</div>
                    </div>
                    <div class="statsContent">
                        <div class="statsDesc">View styles and lookbooks that you've liked on HomeLuxe.</div>
                        <div class="actionButton" onclick="viewLikes()">VIEW LIKES</div>
                    </div>
                </div>

                <!--<div class="statsBoxes" onclick="viewLikes()">-->
                   <!--<div style="width: 100%; height: 100%; background: #468fde; font-size: 25px; color: white; box-sizing: border-box; padding: 100px 35px 40px 35px;">-->
                        <!--Don't know which style suits you best? <br><br><br>-->
                        <!--<span style="font-size: 17px; text-transform: uppercase;">Take the style quiz!</span>-->
                    <!--</div>-->
                <!--</div>-->
            </div>

            <div class="viewPanel" id="viewMyProfile">
                <div class="myProfileBox">
                    <div class="boxHeader">My Profile</div>
                    <div class="myDP"></div>
                    <div class="myInfo">
                        <div class="myInfoIcon"><i class="fa fa-user"></i></div>
                        <div class="myInfoText"><span class="myName"></span></div>
                    </div>
                    <div class="myInfo">
                        <div class="myInfoIcon"><i class="fa fa-envelope"></i></div>
                        <div class="myInfoText"><span class="myEmail"></span></div>
                    </div>
                    <div class="myInfo">
                        <div class="myInfoIcon"><i class="fa fa-phone"></i></div>
                        <div class="myInfoText"><span class="myPhone"></span></div>
                    </div>
                    <div class="myInfo">
                        <div class="myInfoIcon"><i class="fa fa-link"></i></div>
                        <div class="myInfoText"><span class="connectedTo"></span></div>
                    </div>
                </div>
            </div>

            <div class="viewPanel" id="viewMyLikes"></div>

            <div class="viewPanel" id="viewLogout">
                <div class="logoutBox">Logging out... &nbsp; <i class="fa fa-circle-o-notch fa-spin"></i></div>
            </div>

            <div class="viewPanel" id="viewQuiz">
                <div class="comingSoonBox">Feature not ready yet.<br><br>Coming Soon.</div>
            </div>

            <div class="viewPanel" id="viewHelp">
                <div class="comingSoonBox">Feature not ready yet.<br><br>Coming Soon.</div>
            </div>
            <div class="viewPanel" id="viewReport">
                <div class="comingSoonBox">Feature not ready yet.<br><br>Coming Soon.</div>
            </div>
            <div class="viewPanel" id="viewSettings">
                <div class="comingSoonBox">Feature not ready yet.<br><br>Coming Soon.</div>
            </div>

        </div>
    </div>
</div>

<div class="loginOverlay">
    <div class="loginSpacer">

    </div>
    <div class="loginContainer">
        <div class="loginLogoContainer">
            <a href="http://homeluxe.in"><img src="../images/MENU.png" class="loginLogo"></a>
        </div>

        <div class="loginPanel">
            <div class="loginTitleContainer">Sign-in to HomeLuxe</div>
            <input type="text" class="inputBox" id="username" placeholder="USERNAME">
            <input type="password" class="inputBox" id="password" placeholder="PASSWORD">

            <div class="registerButton" onclick="userRegister()">
                SIGN-UP
            </div>

            <div class="loginButton">
                LOGIN
            </div>

            <div class="faceBookLogin" onclick="FBLogin()">
                <i class="fa fa-facebook"></i>
            </div>
        </div>

        <div class="registerPanel" style="display: none;">
            <div class="loginTitleContainer">Sign-up for HomeLuxe</div>

            <input type="text" class="inputBox" id="regName" placeholder="FULL NAME">
            <input type="email" class="inputBox" id="regEmail" placeholder="EMAIL ADDRESS">
            <input type="text" class="inputBox" id="regPhone" placeholder="PHONE NUMBER">
            <input type="password" class="inputBox" id="regPassword" placeholder="PASSWORD">

            <div class="fbRegisterButton" onclick="facebookRegister()">
                SIGN-UP &nbsp; <i class="fa fa-facebook"></i>
            </div>

            <div class="registerButton regStep2" onclick="submitRegister()">
                SIGN-UP
            </div>

            <div class="fbContButton" onclick="fbsubmitRegister()">
                CONTINUE &nbsp; <i class="fa fa-facebook"></i>
            </div>

        </div>

    </div>

    <div class="alertMessage">Alert Message Text</div>
</div>

</body>
</html>