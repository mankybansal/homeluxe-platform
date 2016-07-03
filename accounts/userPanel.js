/**
 * Created by mayankbansal on 6/14/16.
 */

var dashboard = true;

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var myLikes;

function getLikes(){
    requests.getLikes(myUser.token, function(response){
        if(response.success != "false"){
            myLikes = response;
            updateLikes();
        }
    });
}

function updateLikes(){
    $(".dataLikeCount").html(myLikes.length);
    $("#viewMyLikes").empty();
    if(myLikes.length > 0){
        $.each(myLikes, function(index,item){
            if(item.catalogueKey){
                $("#viewMyLikes").append("<div id='"+item.catalogueKey+"' class='likeBox'><div class='likeBoxImageBox'><img src='../images/styles/covers/clear-images/"+item.cover_pic+"' class='likeBoxImage'></div><div class='likeBoxStyleTitle'>"+item.name+"</div><div class='likeBoxDescription'>"+item.description+"</div><div class='likeBoxPrice'><i class='fa fa-rupee'></i>&nbsp;"+item.price+"</div></div>");
                //$("#viewMyLikes").append("<div id='"+item.catalogueKey+"' class='likeBox'><div class='likeBoxImageBox'><img src='../images/NOIMAGE.png' class='likeBoxImage'></div><div class='likeBoxStyleTitle'>"+item.name+"</div><div class='likeBoxDescription'>"+item.description+"</div><div class='likeBoxPrice'><i class='fa fa-rupee'></i>&nbsp;"+item.price+"</div></div>");
            }else{
                $("#viewMyLikes").append("<div class='likeBoxRoom'><div class='likeBoxImageBox'><img src='../images/NOIMAGE.png' class='likeBoxImage'></div><div class='likeBoxStyleTitle'>"+item.name+"</div><div class='likeBoxDescription'>"+item.desc+"</div></div>");

            }
        });
    }
}

var nodeID;

$(document).ready(function () {

    $('.loginOverlay').fadeIn(500);
    
    $(".signOutButton").click(function(){
        Cookies.remove('myUser');
        hideDashboard();
    });

    nodeID = getUrlParameter("nodeID");

    if (myUser = Cookies.getJSON('myUser')) {
        showAlert("Signing in as <b>"+myUser.name+"</b> &nbsp; <i class='fa fa-circle-o-notch fa-spin'></i>");
        setTimeout(showDashboard(),3000);
    }

    $(".menuOption").click(function () {
        var menuGroupSelected = $(this).parent().find(".menuGroupLabel").text();
        var menuOptionSelected = $(this).find(".menuOptionText").text();

        $('.menuGroupSelected').html(menuGroupSelected);
        $('.menuOptionSelected').html(menuOptionSelected);

        $(".menuLeft").find(".optionSelected").removeClass("optionSelected");
        $(this).addClass("optionSelected");
        
        $(".viewPanel").hide();
        
        $("#"+ $(this).find(".menuOptionSelect").attr('class').split(' ')[1]).fadeIn(500);
    });
});

function showDashboard() {
    
    $(".viewPanel").hide();
    $(".menuLeft")
        .find(".optionSelected").removeClass("optionSelected")
        .find(".viewOverview").parent().addClass("optionSelected");
    $("#viewOverview").fadeIn(500);
    
    getLikes();

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
    
    $(".myDP").append("<img src='"+myUser.profile_pic+"' class='myDPimage'>");
    $(".myName").html(myUser.name);
    $(".myEmail").html(myUser.email);
    $(".myPhone").html(myUser.mobile);
    
    if(myUser.fbConnected) $(".connectedTo").html("Connected to Facebook");
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
