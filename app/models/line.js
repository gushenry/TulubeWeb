const mongoose = require('mongoose');

var lineSchema = new mongoose.Schema({
  _id: String,
  segments: Array,
  color: String,
  boardId: String,
  username: String
});

function addLineToDatabase(data, callback) {
  var line = new Line({
    _id: data._id,
    segments: data.segments,
    color: data.color,
    boardId: data.boardId,
    username: data.username
  });
  line.save(function(err, data) {
    if (err) {
      console.log(err);
      callback(false);
    } else {
      callback(true);
    }
  })
}

function getLinesForBoard(boardId, callback) {
  Line.find({ "boardId": boardId }, function(err, lines) {
    callback(lines);
  })
}

function getAllLines(callback) {
  Line.find({}, function(err, lines) {
    callback(lines);
  })
}

function deleteAllLines(callback) {
  Line.remove({}, function(err) {
    if (err) {
      console.log(err);
      callback(false);
    } else {
      callback(true);
    }
  })
}

// function createUser(username) {
//   { item: "card", qty: 15 }
// }



var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    assert.equal(2, docs.length);
    console.log("Found the following records");
    console.dir(docs);
    callback(docs);
  });      
}

module.exports = mongoose.model('Line', lineSchema);