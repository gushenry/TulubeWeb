// const mongoose = require('mongoose');
// var bcrypt = require('bcrypt-nodejs');

// var Schema = mongoose.Schema;
// var userSchema = new Schema({
//   username: String,
//   password: String
// });

// // methods ======================
// // generating a hash
// userSchema.methods.generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

// // checking if password is valid
// userSchema.methods.validPassword = function(password) {
//   return bcrypt.compareSync(password, this.password);
// };

// userSchema.statics.alreadyExists = function(username, callback) {
//   this.findOne({ "username": username }, function(err, person) {
//     if (person) {
//       callback(true);
//     } else {
//       callback(false);
//     }
//   })
// }

// userSchema.statics.addUsernameToDatabase = function(username, callback) {  
//   var user = new User({
//     username: username
//   });
//   user.save(function(err, data) {
//     if (err) {
//       console.log(err);
//       callback(false);
//     } else {
//       console.log('Saved: ', data);
//       callback(true);
//     }
//   })
// }

// module.exports = mongoose.model('User', userSchema);

// // module.exports = {
// //   alreadyExists: alreadyExists,
// //   addUsernameToDatabase: addUsernameToDatabase,
// //   User: User
// // }



// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);