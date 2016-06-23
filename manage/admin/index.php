<?php

include("../../session.php");

?>

<!DOCTYPE html>
<html lang="en">
<head>

    <meta charset="UTF-8">


    <title>Admin | HomeLuxe.in</title>
    <link rel="stylesheet" href="adminPanel.css">
    <link rel="stylesheet" href="../../fontAwesome/css/font-awesome.css">
    <script src="../../jquery.min.js"></script>
    <script src="adminPanel.js"></script>

</head>

<body>

<div class="mainUnderlay">

</div>

<div class="contentOverlay">

    <div class="menuLeft">


            <div class="menuOptionGroup">
                <img src="../../images/logoWhite.png" class="menuHeaderLogo">
            </div>

            <div class="menuOptionGroup">
                <div class="menuGroupLabel">Main</div>

                <div class="menuOption optionSelected">
                    <div class="menuOptionSelect"></div>
                    <div class="menuOptionIcon">
                        <i class="fa fa-dashboard menuIcon"></i>
                    </div>
                    <div class="menuOptionText">Overview</div>
                </div>

                <div class="menuOption">
                    <div class="menuOptionSelect"></div>
                    <div class="menuOptionIcon">
                        <i class="fa fa-bar-chart menuIcon"></i>
                    </div>
                    <div class="menuOptionText">Reports & Stats</div>
                </div>

                <div class="menuOption">
                    <div class="menuOptionSelect"></div>
                    <div class="menuOptionIcon">
                        <i class="fa fa-user menuIcon"></i>
                    </div>
                    <div class="menuOptionText">Users</div>
                </div>
            </div>

            <div class="menuOptionGroup">
                <div class="menuGroupLabel">Project Management</div>

                <div class="menuOption">
                    <div class="menuOptionSelect"></div>
                    <div class="menuOptionIcon">
                        <i class="fa fa-tasks menuIcon"></i>
                    </div>
                    <div class="menuOptionText">Projects</div>
                </div>

                <div class="menuOption">
                    <div class="menuOptionSelect"></div>
                    <div class="menuOptionIcon">
                        <i class="fa fa-paint-brush menuIcon"></i>
                    </div>
                    <div class="menuOptionText">Designers</div>
                </div>

                <div class="menuOption">
                    <div class="menuOptionSelect"></div>
                    <div class="menuOptionIcon">
                        <i class="fa fa-users menuIcon"></i>
                    </div>
                    <div class="menuOptionText">Customers</div>
                </div>
            </div>

            <div class="menuOptionGroup">
                <div class="menuGroupLabel">Lookbook Manager</div>

                <div class="menuOption">
                    <div class="menuOptionSelect"></div>
                    <div class="menuOptionIcon">
                        <i class="fa fa-photo menuIcon"></i>
                    </div>
                    <div class="menuOptionText">Styles</div>
                </div>

                <div class="menuOption">
                    <div class="menuOptionSelect"></div>
                    <div class="menuOptionIcon">
                        <i class="fa fa-check-square-o menuIcon"></i>
                    </div>
                    <div class="menuOptionText">Quiz Settings</div>
                </div>
            </div>

            <div class="menuOptionGroup">
                <div class="menuGroupLabel">Help & Settings</div>

                <div class="menuOption">
                    <div class="menuOptionSelect"></div>
                    <div class="menuOptionIcon">
                        <i class="fa fa-question-circle menuIcon"></i>
                    </div>
                    <div class="menuOptionText">Help</div>
                </div>

                <div class="menuOption">
                    <div class="menuOptionSelect"></div>
                    <div class="menuOptionIcon">
                        <i class="fa fa-exclamation-circle menuIcon"></i>
                    </div>
                    <div class="menuOptionText">Report Error</div>
                </div>

                <div class="menuOption">
                    <div class="menuOptionSelect"></div>
                    <div class="menuOptionIcon">
                        <i class="fa fa-gear menuIcon"></i>
                    </div>
                    <div class="menuOptionText">Settings</div>
                </div>
            </div>


    </div>


    <div class="mainContent">
        <div class="menuTop">

            <img src='../../images/MENU.png' class="menuLogo">
            <div class="menuTitle">HomeLuxe Dashboard</div>
            <div class="menuSection">
                <i class="fa fa-angle-right"></i>&nbsp;<span class="menuGroupSelected">Main</span>
            </div>

            <div class="menuSection">
                <i class="fa fa-angle-right"></i>&nbsp;<span class="menuOptionSelected">Overview</span>
            </div>

            <div class="avatarBox"></div>

            <div class="profileBox">
                <span style="color: #999;">Welcome, </span>
                <span style="color: #333;">Mayank Bansal</span>
            </div>
        </div>
        <div class="fillContent">
            <div class="statsBoxes">
                <div class="statsTint tintBlue">
                    <div class="statsIcon">
                        <i class="fa fa-image"></i>
                        <span style="color: rgba(0,0,0,0.2); margin-left: 10px; ">15</span>
                    </div>
                    <div class="statsTintText">Lookbook Styles</div>
                </div>
                <div class="statsContent">
                    <div class="statsDesc">Add, Delete, Modify Lookbook styles from HomeLuxe.</div>
                    <div class="actionButton">Manage Styles</div>
                </div>
            </div>
            <div class="statsBoxes">
                <div class="statsTint tintGreen">
                    <div class="statsIcon">
                        <i class="fa fa-tasks"></i>
                        <span style="color: rgba(0,0,0,0.2); margin-left: 10px; ">9</span>
                    </div>
                    <div class="statsTintText">Projects</div>
                </div>
                <div class="statsContent">
                    <div class="statsDesc">Manage ongoing or completed customer projects.</div>
                    <div class="actionButton">View Projects</div>
                </div>
            </div>
            <div class="statsBoxes">
                <div class="statsTint tintRed">
                    <div class="statsIcon">
                        <i class="fa fa-users"></i>
                        <span style="color: rgba(0,0,0,0.2); margin-left: 10px; ">11</span>
                    </div>
                    <div class="statsTintText">Customers</div>
                </div>
                <div class="statsContent">
                    <div class="statsDesc">Get customer details, view projects history and more.</div>
                    <div class="actionButton">Customer Manager</div>
                </div>
            </div>
            <br>
            <div class="majorBoxes">
                <div class="statsTint tintGrey"></div>
                <div class="statsContent">
                    <div class="statsDesc">Some text can go here about what this panel does.</div>
                    <div class="actionButton">Action Button</div>
                </div>
            </div>
            <div class="majorBoxes">
                <div class="statsTint tintGrey"></div>
                <div class="statsContent">
                    <div class="statsDesc">Some text can go here about what this panel does.</div>
                    <div class="actionButton">Action Button</div>
                </div>
            </div>

            <br>
            <div class="fullBoxes">
                <div class="statsTint tintGrey"></div>
                <div class="statsContent">
                    <div class="statsDesc">Some text can go here about what this panel does.</div>
                    <div class="actionButton">Action Button</div>
                </div>
            </div>

        </div>
    </div>
</div>

<div class="loginOverlay">
    <div class="loginSpacer">

    </div>
    <div class="loginContainer">
        <div class="loginLogoContainer">
            <img src="../../images/MENU.png" class="loginLogo">
        </div>
        <div class="loginTitleContainer">HomeLuxe Dashboard</div>
        <input type="text" class="inputBox" id="username" placeholder="USERNAME">
        <input type="password" class="inputBox" id="password" placeholder="PASSWORD">
        <div class="loginButton">
            LOGIN
            <span class="loginLoader">
                &nbsp;
                <i class="fa fa-circle-o-notch fa-spin"></i>
            </span>
        </div>
    </div>

    <div class="alertMessage">Alert Message Text</div>
</div>

</body>
</html>