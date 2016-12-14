const mongoose = require('mongoose');

var boardSchema = new mongoose.Schema({
  title: String,
  creator: String,
  collaborators: [String]
});

function addBoardToDatabase(data, callback) {
  var board = new Board({
    _id: data._id,
    title: data.title,
    creator: data.creator
  });
  board.save(function(err, data) {
    if (err) {
      console.log(err);
      callback(false);
    } else {
      callback(true);
    }
  })
}

function getBoardsForUser(username, callback) {
  Board.find({ "username": username }, function(err, boards) {
    callback(boards);
  })
}

// create the model for users and expose it to our app
module.exports = mongoose.model('Board', boardSchema);