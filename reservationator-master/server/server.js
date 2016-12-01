var http = require('http');
var qs = require('querystring');
var request = require('request');
var express = require('express');


var app = express();//the app is the server

const PORT = 8080;  //incoming http PORT

function listener(request, response) {  //big boi function for server handling
    console.log("Request recieved...");

    var body = [];
    request.on('data', function(data) {
      body += data;
        //TODO check for data overload
    });
    request.on('end', function() {
        console.log("DATA RECIEVED: " + body);
        var json = JSON.parse(body);
        if(json.event == "getdays") {
            console.log("Returning dates from " + json.start + " to " + json.end);
            var start = days.indexOf(json.start);
            var end = days.indexOf(json.end);
            var resarr = dayarray.slice(start, end);
            var resJson = {};
            for(var i = 0; i < resarr.length; i++) {
              resJson[resarr[i].day] = resarr[i].info;
            }

            var res = JSON.stringify(resJson);
            console.log("returning days: " + res);
            console.log("dayrange: " + start + " " + end);
            response.end(res);
        }
        else if (json.event == "addSchedule") {

        }
        else if (json.event == "resourcetypestatus") {
            var result = checkResourceTypeStatus(json.year, json.month, json.day)
        }
        else if (json.event == "gapiverify") {
            var resJSON = {verified : false};   //initialize json response object
            verifyUserToken(json.token).then( (user) => {   //verify token with google api
                if (user.verified) {
                    resJSON.verified = true;
                    mongo().then(function(db) {     //create connection with database
                        db.collection("users").find({googleID : user.sub}).toArray(function(err, result) {  //retrieve user that is trying to join group
                            if(err) { reject(err); }
                            else if (!result.length) {              //if no user was found
                                db.collection("users").insertOne(   //add a user
                                    {
                                        first_name : user.given_name,
                                        last_name : user.family_name,
                                        googleID : user.sub,
                                        groups : []
                                    });
                            } else {
                                resJSON.groups = result[0].groups;  //give user previously joined groups as options to join
                            }
                            response.end(JSON.stringify(resJSON));
                        });
                    });
                }
            }, (err) => {
                console.log("User token verification failed!!");
                response.end(JSON.stringify(resJson));
            });
        }
        else if (json.event == "joingroup") {
            var resJSON = {groupID : json.groupID};
            verifyUserToken(json.token).then( (user) => {   //verify token with google
                if(user.verified) {
                    resJSON.verified=true;
                    mongo().then( (db) => {
                        db.collection("groups").find({name : json.groupID}).toArray( (err, result) => { //retrieve group
                            console.log(result);
                            if(err == null && result.length)   //if theres not an error and a group with that name was found
                            {
                                if ((result[0].users).indexOf(user.sub) > -1) { //check if the user is part of the group
                                    resJSON.joined = true;
                                } else if (!result.restrictive) {               //check if group allows any user to join
                                    db.collection("groups").update({name : json.groupID}, {$push : {users : user.sub}});
                                    resJSON.joined = true;
                                } else {                                        //otherwise don't let user join
                                    resJSON.joined = false;
                                }
                                //TODO create session or something for user and return group data
                            } else {
                                if(err)
                                {
                                    console.log("ERRROROR!!!" + err);
                                } else {
                                    resJSON.joined = false;
                                }
                            }
                            response.end(JSON.stringify(resJSON));
                        });
                    });
                } else {
                    resJSON.verified = false;
                    response.end(JSON.stringify(resJSON));
                }

            });
        }
        else if (json.event == "creategroup") {
            var resJSON = {verified : false, groupCreated : false};
            verifyUserToken(json.token).then( (user) => {
                if(user.verified) {
                    resJSON.verified=true;
                    mongo().then( (db) => {
                        console.log("here");
                        //TODO should make sure group doesnt allready exist here.
                        if(!db.collection("groups").find({name : json.name}))
                        {
                            db.collection("groups").insert({name : json.name, description : json.description, restrictive : json.restrictive, users : [user.sub]});
                            resJSON.groupCreated = true;
                            resJSON.group = db.collection("groups").find({name : json.group});
                        }
                    });
                }
            });
            response.end(JSON.stringify(resJSON));
        }
        else {
            var resJSON = {"pung" : "true"};
            response.end(JSON.stringify(resJSON));
        }

        //add resource
        //add resourceType


  });

}

app.use("/", express.static(__dirname + "/../client")); //serving html
app.post("/rest", listener);                            //serving api




app.listen(PORT, function() {
  console.log("Server listening on " + PORT);
})
