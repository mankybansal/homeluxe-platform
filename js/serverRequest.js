/**
 * Created by mayankbansal on 6/23/16.
 */

var guestToken = false; // GLOBAL guestToken used for making API requests
var apiBaseURL; // URL for API
var baseURL; // SERVER Base URL for loading Assets

//SETS URL between Production & Dev Server
function getServer() {
    if (typeof location.origin != 'undefined') {
        if (location.host === 'dev.homeluxe.in') {
            apiBaseURL = "https://dev.homeluxe.in:3000/";
            baseURL = "https://dev.homeluxe.in/";
        } else {
            apiBaseURL = "http://homeluxe.in:3000/";
            baseURL = "http://homeluxe.in/";
        }
    }
}

// Server Request Function with callback
function serverRequest(url, data, callback) {
    console.log(guestToken);
    if (!guestToken) {
        guestToken = true;
        getGuestToken(function () {
            // Update passed data with new token
            data.token = guestToken;
            // Make request again
            serverRequest(url, data, callback)
        });
    } else {
        $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/x-www-form-urlencoded",
            url: apiBaseURL + url,
            data: data,
            timeout: 25000, // sets timeout
            success: function (response) {
                console.log(response);
                callback && callback(response);
            },
            error: function (response) {
                console.log(response);
                console.log("SERVER REQUEST ERROR");
            }
        });
    }
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
            'token': guestToken
        };
        serverRequest("browse", myObject, callback);
    },

    getQuiz: function (callback) {
        var myObject = {
            "submit": 0,
            "token": guestToken
        };
        serverRequest("quiz", myObject, callback);
    },

    submitQuiz: function (answerSet, callback) {
        var myObject = {
            "submit": 1,
            "token": guestToken,
            "answer_set": answerSet
        };
        serverRequest("quiz", myObject, callback);
    },

    getLikes: function (userToken, callback) {
        var myObject = {
            "token": userToken
        };
        serverRequest("member/likes", myObject, callback);
    },

    likeNode: function (userToken, nodeID, callback) {
        var myObject = {
            "token": userToken,
            "like_node": nodeID
        };
        serverRequest("member/like", myObject, callback);
    }
};

// GLOBAL function for getting a guestToken
function getGuestToken(callback) {
    requests.getGuestToken(function (response) {
        if (response.success) {
            guestToken = response.token;
            callback && callback();
        }
    });
}

$(document).ready(function () {
    getServer();
    console.log("Connected to: " + apiBaseURL);
});