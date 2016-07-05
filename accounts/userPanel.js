/**
 * Created by mayankbansal on 6/14/16.
 */

var dashboard = true;
guestToken = true;

homeluxeApp.controller("memberDashboardControl", function ($scope, $rootScope, $interval) {

    getServer();
    $scope.init = function () {
        $scope.myLikes = {};
        if($scope.$parent.ngMyUser = Cookies.getJSON('myUser')){
            $scope.getLikes();
            $scope.showDashboard();
        }else{
            hideDashboard();
        }
    };

    $scope.showDashboard = function () {

        $(".viewPanel").hide();
        $(".menuLeft")
            .find(".optionSelected").removeClass("optionSelected")
            .find(".viewOverview").parent().addClass("optionSelected");
        $("#viewOverview").fadeIn(500);

        setTimeout(function () {
            $('.contentOverlay').fadeIn(1000);
        }, 1000);
    };

    $scope.getLikes = function () {
        requests.getLikes($scope.$parent.ngMyUser.token, function (response) {
            $scope.$apply(function () {
                if (typeof response.success == 'undefined' && response.success != "false")
                    $scope.myLikes = response;
            });
        });
    };
    
    $scope.logout = function(){
        $scope.$parent.logout();
        hideDashboard();
    };
    
    $scope.init();
});


$(document).ready(function () {

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

function hideDashboard() {
    setTimeout(function () {
        $('.contentOverlay').fadeOut(500);
    }, 1000);

    setTimeout(function () {
        $('.loginOverlay').fadeIn(500);
        showAlert("Successfully logged out.");
    }, 1500);
}