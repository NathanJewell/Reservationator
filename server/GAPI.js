var verifier = require('google-id-token-verifier');
var request = require('request');

// ID token from client

// app's client IDs to check with audience in ID Token.
var clientId = '795485120668-g9bvskc0h1fgp6v1u2n1ll06otvg6f9g.apps.googleusercontent.com';
function verifyUserToken(token) {       //return a user with basic info
    return new Promise(function(fullfill, reject) {     //using a promise because of async
        request({   //making api call for google authentication
            url : "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token="+token, //sending request to Google's servers to check authentication
            method : "POST",
            async : false
        }, function(error, response, body) {
            var bodyJSON = JSON.parse(body);
            console.log("Verifying token");
            if(!bodyJSON.aud) {
                reject("Something was wrong with the token...");
            } if(bodyJSON.aud == clientId) {
                bodyJSON["verified"] = true;
                fullfill(bodyJSON);
            } else {
                fullfill({verified : false});
            }

        })
    })
}
