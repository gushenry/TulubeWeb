const mongoose = require('mongoose');

var deviceCodeSchema = new mongoose.Schema({
  _id: String,
  socketId: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('DeviceCode', deviceCodeSchema);