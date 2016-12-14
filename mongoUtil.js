var MongoClient = require( 'mongodb' ).MongoClient;

// Connection URL 
var username = process.env.TULUBE_DB_USERNAME
var password = process.env.TULUBE_DB_PASSWORD

var databaseUrl = 'mongodb://'+username+':'+password+'@ds031607.mlab.com:31607/tulube';

var _db;

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect(databaseUrl, function( err, db ) {
      _db = db;
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  }
};



// server.js Code

// // var mongoUtil = require( './mongoUtil.js' );

// // mongoUtil.connectToServer( function( err ) {
// //   // start the rest of your app here
// // } );


// // var db = require("mongojs").connect(databaseUrl, collections);

// // Use connect method to connect to the Server 
// // MongoClient.connect(databaseUrl, function(err, database) {
// //   db = database;

// //   // db.users.insert({ item: "card", qty: 15 })
// //   // console.log("Connected correctly to server")
// //   // console.log(db.users.find( { username: "gushenry" } ));

// //   user.alreadyExists(db, "gushenry", function(value) {
// //     console.log('this line');
// //     console.log(value);
// //   });

//   // db.close()
// // });