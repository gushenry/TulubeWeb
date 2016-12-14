var socket = io.connect();

// socket.on('newuser', function(data) {
//   // Do something
// })

socket.on('getBoardsForUser', function(boards) {
  Board.loadBoards(boards);
})

socket.on('newClientEmptyLine', function(data) {
  var line = new Line(data._id, data.color, data.boardId, data.userId);
  allLines[line._id] = line;
})

socket.on('newClientSegment', function(data) {
  // drawSegment(data.startX, data.startY, data.endX, data.endY);
  // Currently duplicates all segments for drawer
  var segment = new Segment(data.boardId,
                            data.lineId,
                            data.startX, 
                            data.startY, 
                            data.endX, 
                            data.endY, 
                            data.thickness)
  segment.draw(allLines);
})

socket.on('usernameConfirmed', function(data) {
  session.username = data.username;
  $("#loggedInMessage").text('Welcome, '+data.username);
  $("#usernameModal").modal('toggle');
  // $("#boardsModal").modal('toggle');
})

socket.on('usernameTaken', function(data) {
  $("#loggedInMessage").text('Welcome back, '+data.username);
  $("#usernameModal").modal('toggle');
  // $("#boardsModal").modal('toggle');
})

// socket.on('getAllLines', function(lines) {
//   lines.forEach(function(line) {
//     let newLine = new Line(line._id, line.color, line.boardId, line.username, line.segments);
//     // allLines.push(newLine);
//     allLines[line._id] = newLine;
//     newLine.draw(allLines);
//   });
// })

socket.on('clearCanvas', function(data) {
  canvasHandler.clearCanvas();
})