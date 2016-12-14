var User = require("../app/models/user.js");
var Line = require("../app/models/line.js");
var Board = require("../app/models/board.js");
var DeviceCode = require("../app/models/device-code.js")

exports.init = (io) => {

    io.on('connection', function(socket) {

      // This is NOT an ideal way to do this
      // (Purpose is for connecting to Apple TV)
      var code = new DeviceCode({
        _id: Math.random().toString(36).substr(2, 6).toUpperCase(),
        socketId: socket.id
      });
      code.save(function(err, data) {
        if (err) {
          console.log(err);
        } else {
          socket.emit('deviceCode', { '_id' : code._id });
        }
      })

      socket.on('broadcastToTV', function(data) {
        DeviceCode.findOne({ "_id": data.code.toUpperCase() }, function(err, device) {
          if (err) {
            console.log(err);
          } else {
            Line.find({ boardId: data.boardId }, function(err, lines) {
              if (err) {
                console.log(err);
              } else {
                var tv = io.sockets.connected[device.socketId]
                for (var key in tv.rooms) {
                  if (key.length == 24) {
                    tv.leave(key);
                  }
                }
                tv.join(data.boardId);
                // console.log('rooms are:');
                // console.log(io.sockets.manager.roomClients[device.socketId]);
                io.to(device.socketId).emit('clearCanvas');
                io.to(device.socketId).emit('getAllLines', lines);
              }
            })
          }
        })
      })

      socket.on('sendLoadImage', function(data) {
        socket.broadcast.to(data.boardId).emit('loadImage');
      })
      
      socket.on('getBoardsForUser', function(data) {
        board.getBoardsForUser(data.username, function(boards) {
          socket.emit('getBoardsForUser', boards);
        })
      })

      socket.on('newServerBoard', function(data) {
        board.addBoardToDatabase(data, function(success) {
          if (success) {
            socket.emit('newBoardConfirmed', {});
          }
        })
      })

      socket.on('getLinesForBoard', function(data) {
        line.getLinesForBoard(data.board, function(lines) {
          socket.emit('getLinesForBoard', lines);
        })
      })

      socket.on('newUsernameRequest', function(data) {
        User.alreadyExists(data.username, function(alreadyExists) {
          if (alreadyExists) {
            socket.emit('usernameTaken', data)
          } else {
            var user = new User({ username: data.username });
            user.save(function(err, data) {
              if (err) {
                console.log(err);
              } else {
                socket.emit('usernameConfirmed', data);
              }
            })
          }
        });
      })

      socket.on('requestCanvasCleared', function(data) {
        Line.remove({ boardId: data.boardId }, function(err) {
          if (err) {
            console.log(err);
            console.log('clearCanvasFailed', {});
          } else {
            io.to(data.boardId).emit('clearCanvas');
          }
        });
      })

      socket.on('addCollaborator', function(data) {
        Board.findOne({ _id: data.boardId }, function(err, board) {
          board.collaborators.push(data.email);
          board.save(function(err, data) {
            if (err) {
              console.log(err);
            }
          })
        })
      })

      socket.on('joinRoom', function(data) {
        socket.join(data._id);
      })

      socket.on('leaveRoom', function(data) {
        socket.leave(data._id);
      })

      socket.on('newServerSegment', function(data) {
        socket.broadcast.to(data.boardId).emit('newClientSegment', data);
      });

      socket.on('newServerEmptyLine', function(data) {
        io.to(data.boardId).emit('newClientEmptyLine', data);
      });

      socket.on('newServerLine', function(data) {
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
          }
        })
      });
    })
  
}