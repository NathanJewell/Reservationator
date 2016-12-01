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
