/**
 * Created by mayankbansal on 6/23/16.
 */


var guestToken;

function serverRequest(url, data, callback) {
    $.ajax({
        type: "POST",
        url: "http://homeluxe.in:3000/" + url,
        data: data,
        timeout: 25000 // sets timeout
    }).done(function (response) {
        callback && callback(response);
    }).fail(function () {
        console.log("ERROR");
    });
}

var requests = {
    getGuestToken: function (callback) {
        var myObject = {};
        serverRequest("getToken", myObject, callback);
    },

    userLogin: function (username, password, callback) {
        var myObject = {
            "token": apiToken,
            "email": username,
            "password": password
        };
        serverRequest("member/login", myObject, callback);
    },

    userRegiserForm: function (name, email, phone, password, callback) {
        var myObject = {
            "token": apiToken,
            "name": name,
            "email": email,
            "mobile": phone,
            "password": password
        };
        serverRequest("member/register", myObject, callback);
    },

    userRegisterFacebook: function (name, email, oAuth, profilePic, callback) {
        var myObject = {
            "token": apiToken,
            "name": name,
            "email": email,
            "password": oAuth,
            "oauth": oAuth,
            "profile_pic": profilePic
        };
        serverRequest("member/register", myObject, callback);
    }
};

function getGuestToken() {
    requests.getGuestToken(function (response) {
        console.log("NEW RESPONSE" + response.token);
    });
}
