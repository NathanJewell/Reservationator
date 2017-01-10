var clndr = require('node-calendar');

function resourceType(name, group, properties) {
    this.name = name;
    this.group = group;
    this.properties = properties;
    //for(i = 0; i < p.length; i++)
    //{
    //    this.properties[p[i]] = "";
    //}
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

function reservation(type, period)

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
