/**
 * Created by mayankbansal on 6/14/16.
 */

var dashboard = true;


homeluxeApp.controller("memberDashboardControl", function ($scope, $rootScope, $interval) {

    getServer();

    $scope.init = function () {
        $scope.myLikes = [];
        $scope.getLikes();
    };


    $scope.getLikes = function () {
        if ($scope.$parent.ngMyUser = Cookies.getJSON("myUser")) {
            console.log($scope.$parent.ngMyUser);
            requests.getLikes($scope.$parent.ngMyUser.token, function (response) {
                $scope.$apply(function () {
                    if (response.success != "false") {
                        $scope.myLikes = response;
                    }
                });
            });
        }
    };

    $scope.init();
});


$(document).ready(function () {

    $('.loginOverlay').show();

    $(".signOutButton").click(function () {
        Cookies.remove('myUser');
        hideDashboard();
    });
    //
    // if (myUser = Cookies.getJSON('myUser')) {
    //     showAlert("Signing in as <b>" + myUser.name + "</b> &nbsp; <i class='fa fa-circle-o-notch fa-spin'></i>");
    //     setTimeout(showDashboard(), 3000);
    // }

    $(".menuOption").click(function () {
        var menuGroupSelected = $(this).parent().find(".menuGroupLabel").text();
        var menuOptionSelected = $(this).find(".menuOptionText").text();

        $('.menuGroupSelected').html(menuGroupSelected);
        $('.menuOptionSelected').html(menuOptionSelected);

        $(".menuLeft").find(".optionSelected").removeClass("optionSelected");
        $(this).addClass("optionSelected");

        $(".viewPanel").hide();

        $("#" + $(this).find(".menuOptionSelect").attr('class').split(' ')[1]).fadeIn(500);
    });
});

function showDashboard() {

    $(".viewPanel").hide();
    $(".menuLeft")
        .find(".optionSelected").removeClass("optionSelected")
        .find(".viewOverview").parent().addClass("optionSelected");
    $("#viewOverview").fadeIn(500);

    setTimeout(function () {
        $('.loginOverlay').fadeOut(1000);
    }, 2000);

    setTimeout(function () {
        $('.contentOverlay').fadeIn(1000);
    }, 3000);

    $(".dataName").html(myUser.name);
    if (myUser.profile_pic)
        $(".avatarBox").empty().append("<img class='profilePic' src='" + myUser.profile_pic + "'/>");
    else
        $(".avatarBox").empty().append("<i class='fa fa-user' style='font-size: 25px; margin-top: 7.5px; margin-left: 10px; color: rgba(0,0,0,0.2);'></i>");

    $(".myDP").append("<img src='" + myUser.profile_pic + "' class='myDPimage'>");
    $(".myName").html(myUser.name);
    $(".myEmail").html(myUser.email);
    $(".myPhone").html(myUser.mobile);

    if (myUser.fbConnected) $(".connectedTo").html("Connected to Facebook");
    else $(".connectedTo").html("Not Connected");
}

function hideDashboard() {
    setTimeout(function () {
        $('.contentOverlay').fadeOut(1000);
    }, 2000);

    setTimeout(function () {
        $('.loginOverlay').fadeIn(1000);
        showAlert("Successfully logged out.");
    }, 3000);
}
