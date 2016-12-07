var mongoClient = require("mongodb").MongoClient;
var assert = require("assert");

var url = 'mongodb://localhost:27017/reservationator';

function mongo() {
    return mongoClient.connect(url);
}

/*
module.exports = function(params) {

  var ip = params.ip || process.env.IP;
  var port = params.port || 27017;
  var collection = params.collection;

  var db = MongoClient.connect('mongodb://' + ip + ':' + port + '/' + collection);

  return db;

}
*/
var verifier = require('google-id-token-verifier');
var request = require('request');

// ID token from client

// app's client IDs to check with audience in ID Token.
var clientId = '795485120668-g9bvskc0h1fgp6v1u2n1ll06otvg6f9g.apps.googleusercontent.com';
function verifyUserToken(token) {
    return new Promise(function(fullfill, reject) {
        request({   //making api call for google authentication
            url : "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token="+token,
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

  //var verification = verifier.verify(tokenJSON.token, clientId, function(err, info) {
//    console.log(err);
    //console.log(info);
  //});
  //if(verification) {return true;} else {return false;}
}
var clndr = require('node-calendar');

function resourceType(name, group, properties) {
    this.name = "";
    this.group = "";
    this.properties = properties || {};
}

function resourceInstance(type, name, properties) {
    this.name = name || this.id;
    this.type = type;
    this.properties = properties || typelist[type].properties;
}

function day(year, month, day, schedules) {
    this.date = String(year) + String(month) + String(day);
    this.year = year || 2016;
    this.month = month || 1;
    this.day = day || 1;
    this.schedules = schedules || [];
    this.addSchedule = function(schedule) {
      this.schedules.push(schedule);
    }
}

function schedule(name) {
    this.name = name || "sch"   //name for schedule (can be added to multiple days)
    this.reservables = [];      //list of resources that can be reserved during periods in this schedule
    this.periods = [];          //portions of time during which reservables can be schedules
    this.addPeriod = function(name, start, end) {
        var p = {
            "name" : name,
            "start" : start,
            "end" : end
        }
        this.periods.push(p);
    }
    this.addReservable = function(name) {
        this.reservables.push(name);
    }
}

var epoch = new Date().getTime();
var datetime = Date(epoch).split(" ");
var date = {
    dayname : datetime[0],
    month : datetime[1],
    daynumber : datetime[2],
    year : datetime[3],
    time : datetime[4],
    zonecode : datetime[5],
    zonename : datetime[6]
}

var dayarray = [];
var days = [];

var aday = new schedule("a-day");
aday.addPeriod("Period 1", "8:15am", "9:47am");
aday.addPeriod("Period 2", "9:52am", "11:25");
aday.addReservable("chromecart");

var bday = new schedule("b-day");
bday.addPeriod("Period 5", "8:15am", "9:47am");
bday.addPeriod("Period 6", "9:52am", "11:25");
bday.addReservable("chromecart");


var chromecart = new resourceType("chromecart");

//app.get('/event', listener);
for(mm = 0; mm < 12; mm++) {
    for(dd = 0; dd < 30; dd++) {
        var d = new day(2016, mm, dd);
        if(dd%2 == 0) {d.addSchedule(bday);} else {d.addSchedule(aday);}

        var ddd = "2016" + String(mm+1) + String(dd+1);

        dayarray.push(d);


        days.push(ddd);
    }
}
mongo().then((db) => {
    db.collection("days").find().toArray((err, res) => {
        if(!err && !res.length) {
            db.collection("days").insertMany(dayarray);
            db.close();
        } else {
            console.log("No days added.");
        }
    });
});
//var cal = new clndr.Calendar(clndr.MONDAY);
//var yearCalendar = cal.yeardayscalendar(epoch);
//console.log(date);
//console.log(cal.itermonthdates(2016, 2));
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
        else if (json.event == "day") {

        }
        else if (json.event == "getdayinfo") {
            var resJSON = {verified : false, success : false};   //initialize json response object
            verifyUserToken(json.token).then( (user) => {   //verify token with google api
                if (user.verified) {
                    resJSON.verified = true;
                    mongo().then(function(db) {     //create connection with database
                        db.collection("days").find({date : json.ymd}).toArray(function(err, result) {  //retrieve dayta
                            if(!error && result.length)
                            {
                                resJSON.day = JSON.stringify(result[0]);
                                resJSON.success = true;
                                response.end(JSON.stringify(resJSON));
                            } 
                            //otherwise theres a problem.....
                        });
                    });
                }

            }, (err) => {
                console.log("Day retrieval failed!");
                response.end(JSON.stringify(resJson));
            });
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
            var resJSON = {groupID : json.groupID, success : false};
            verifyUserToken(json.token).then( (user) => {   //verify token with google
                if(user.verified) {
                    resJSON.verified=true;
                    mongo().then( (db) => {
                        db.collection("groups").find({name : json.groupID}).toArray( (err, result) => { //retrieve group
                            console.log(result);
                            if(err == null && result.length)   //if theres not an error and a group with that name was found
                            {
                                if ((result[0].users).indexOf(user.sub) > -1) { //check if the user is part of the group
                                    resJSON.success = true;
                                } else if (!result.restrictive) {               //check if group allows any user to join
                                    db.collection("groups").update({name : json.groupID}, {$push : {users : user.sub}});
                                    resJSON.success = true;
                                } else {                                        //otherwise don't let user join
                                    
                                }
                                //TODO create session or something for user and return group data
                            } else {
                                if(err)
                                {
                                    console.log("ERRROROR!!!" + err);
                                } else {
                                    resJSON.success = false;
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
            var resJSON = {verified : false, success : false};
            verifyUserToken(json.token).then( (user) => {
                if(user.verified) {
                    resJSON.verified=true;
                    mongo().then( (db) => {
                        //TODO should make sure group doesnt allready exist here.
                        db.collection("groups").find({name : json.name}).toArray((err, result) => {
                            console.log(result);
                            if(err == null && !result.length)   //if theres not an error and a group with that name was not found
                            {

                                db.collection("groups").insertOne(
                                    {
                                        name : json.name,
                                        description : json.description,
                                        restrictive : json.restrictive,
                                        users : [user.sub]
                                    }
                                );
                                resJSON.success = true;
                                db.collection("groups").find({name : json.group}).toArray((err, result) => {
                                    if(err == null)
                                    {
                                        resJSON.group = result;
                                    }
                                    else{resJSON.group = "ERROR RETRIEVING GROUP"}
                                    response.end(JSON.stringify(resJSON));
                                });
                            } else {
                                if(err)
                                {
                                    console.log("ERRROROR!!!" + err);
                                }
                                response.end(JSON.stringify(resJSON));
                            }

                        });
                    });

                }
            });
        }
        else if (json.event == "createresourcetype") {
             var resJSON = {verified : false, success : false};
            verifyUserToken(json.token).then( (user) => {
                if(user.verified) {
                    resJSON.verified=true;
                    mongo().then( (db) => {
                        //TODO should make sure group doesnt allready exist here.
                        db.collection("resourcetypes").find({name : json.name, group : json.group}).toArray((err, result) => {
                            console.log(result);
                            if(err == null && !result.length)   //if theres not an error and a type with that name was not found for the group
                            {

                                db.collection("resourcetypes").insertOne(
                                    new resourceType(json.name, json.group, json.props)
                                );
                                resJSON.typeCreated = true;
                                db.collection("resourcetypes").find({name : json.name}).toArray((err, result) => {
                                    if(err == null)
                                    {
                                        resJSON.type = result;
                                    }
                                    else{resJSON.group = "ERROR RETRIEVING TYPE"}
                                    response.end(JSON.stringify(resJSON));
                                });
                            } else {
                                if(err)
                                {
                                    console.log("ERRROROR!!!" + err);
                                }
                                response.end(JSON.stringify(resJSON));
                            }

                        });
                    });

                }
            });
        }
        else if (json.event == "createresource") {
            var resJSON = {verified : false, success : false};
            verifyUserToken(json.token).then( (user) => {
                if(user.verified) {
                    resJSON.verified=true;
                    mongo().then( (db) => {

                        db.collection("resources").insertOne(
                            new resourceInstance(json.type, json.group, json.props)
                        );
                        resJSON.success = true;
                        db.collection("resources").find({name : json.name}).toArray((err, result) => {
                            if(err == null)
                            {
                                resJSON.type = result;
                            }
                            else{resJSON.group = "ERROR RETRIEVING TYPE"}
                            response.end(JSON.stringify(resJSON));
                        });
                    });
                }
            });
        }
        else if (json.event == "getgrouptypes") {
            var resJSON = {verified : false, success : false};
            mongo().then( (db) => {
                db.collection("resourcetypes").find({group : json.group}).toArray((err, result) => {
                    if(err) {
                        console.log("Error finding resources for group.")
                    } else {
                        resJSON.success = true;
                        resJSON.types = result;
                    }
                    response.end(JSON.stringify(resJSON));
                });
            });
        }
        else {
            var resJSON = {"pung" : "true"};
            response.end(JSON.stringify(resJSON));
        }


  });

}

app.use("/", express.static(__dirname + "/../client")); //serving html
app.post("/rest", listener);                            //serving api




app.listen(PORT, function() {
  console.log("Server listening on " + PORT);
})
