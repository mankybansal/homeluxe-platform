/**
 * Created by mayankbansal on 6/23/16.
 */

// GLOBAL guestToken used for making API requests
var guestToken;

// Server Request Function with callback
function serverRequest(url, data, callback) {
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: "application/x-www-form-urlencoded",
        url: "http://homeluxe.in:3000/" + url,
        data: data,
        timeout: 25000 // sets timeout
    }).done(function (response) {
        callback && callback(response);
    }).fail(function () {
        console.log("SERVER REQUEST ERROR");
    });
}

var requests = {
    getGuestToken: function (callback) {
        var myObject = {};
        serverRequest("getToken", myObject, callback);
    },

    userLogin: function (username, password, callback) {
        var myObject = {
            "token": guestToken,
            "email": username,
            "password": password
        };
        serverRequest("member/login", myObject, callback);
    },

    userRegiserForm: function (name, email, phone, password, callback) {
        var myObject = {
            "token": guestToken,
            "name": name,
            "email": email,
            "mobile": phone,
            "password": password
        };
        serverRequest("member/register", myObject, callback);
    },

    userRegisterFacebook: function (name, email, oAuth, profilePic, callback) {
        var myObject = {
            "token": guestToken,
            "name": name,
            "email": email,
            "password": oAuth,
            "oauth": oAuth,
            "profile_pic": profilePic
        };
        serverRequest("member/register", myObject, callback);
    },

    getStyles: function (callback) {
        var myObject = {
            "token": guestToken
        };
        serverRequest("styles", myObject, callback);
    },

    getQuiz: function (callback) {
        var myObject = {
            "submit": 0,
            "token": guestToken
        };
        serverRequest("quiz", myObject, callback);
    },

    submitQuiz: function (answerSet,callback) {
        var myObject = {
            "submit": 1,
            "token": quizToken,
            "answer_set": answerSet
        };
        serverRequest("quiz",myObject,callback);
    },
    
    getLikes: function (userToken, callback){
        var myObject = {
            "token": userToken
        };
        serverRequest("member/likes", myObject, callback);
    },
    
    likeNode: function (userToken, nodeID, callback){
        var myObject = {
            "token": userToken,
            "like_node": nodeID
        };
        serverRequest("member/like", myObject, callback);
    }
};

// GLOBAL function for getting a guestToken
function getGuestToken() {
    requests.getGuestToken(function (response) {
        if (response.success)
            guestToken = response.token;
    });
}

// Get guestToken on page load
$(document).ready(function () {
    getGuestToken();
});
