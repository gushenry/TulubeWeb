var currentColor = "#000000";
var allLines = {};
var board;

window.onload = function() {

  var currentLine;
  var userId = 0;

  var startX;
  var startY;

  var mouseIsDown = false;




  var doOnTouchStart = function(event){                   
    event.preventDefault();

    // Get x and y values of finger
    startX = event.touches[0].clientX - canvasHandler.canvas.offsetLeft;
    startY = event.touches[0].clientY - canvasHandler.canvas.offsetTop-50;

    // Create new Line
    currentLine = new Line(ObjectId(), currentColor, board._id, username);
    allLines[currentLine._id] = currentLine;
    currentLine.sendEmptyLineToServer()

    if (event.touches[0]["force"] && event.touches[0]["force"] != 0) {
      var thickness = event.touches[0]["force"] * 15;
    } else {
      var thickness = 5;
    }

    // Create new Segment and add to currentLine
    let segment = new Segment(board.id,
                              currentLine._id,
                              startX, 
                              startY, 
                              startX, 
                              startY, 
                              thickness);
    currentLine.segments.push(segment);

    segment.draw(allLines);
    segment.sendToServer();
  }

  var doOnMouseDown = function(event){                   
    event.preventDefault();

    mouseIsDown = true;

    // Get x and y values of finger
    startX = event.x - canvasHandler.canvas.offsetLeft;
    startY = event.y - canvasHandler.canvas.offsetTop-50;

    // Create new Line
    currentLine = new Line(ObjectId(), currentColor, board._id, username);
    allLines[currentLine._id] = currentLine;
    currentLine.sendEmptyLineToServer()

    // Create new Segment and add to currentLine
    let segment = new Segment(board.id,
                              currentLine._id,
                              startX, 
                              startY, 
                              startX, 
                              startY, 
                              5);
    currentLine.segments.push(segment);

    segment.draw(allLines);
    segment.sendToServer();
  }

  canvasHandler.canvas.addEventListener("touchstart", doOnTouchStart);
  canvasHandler.canvas.addEventListener("mousedown", doOnMouseDown);





  var doOnTouchMove = function(event){
    event.preventDefault();                 

    var endX = event.touches[0].clientX - canvasHandler.canvas.offsetLeft;
    var endY = event.touches[0].clientY - canvasHandler.canvas.offsetTop-50;

    if (event.touches[0]["force"] && event.touches[0]["force"] != 0) {
      var thickness = event.touches[0]["force"] * 15;
    } else {
      var thickness = 5;
    }

    // Create new Segment and add to currentLine
    let segment = new Segment(board._id,
                              currentLine._id,
                              startX, 
                              startY, 
                              endX, 
                              endY, 
                              thickness);
    currentLine.segments.push(segment);
    
    startX = endX;
    startY = endY;

    segment.draw(allLines);
    segment.sendToServer();
  }

  var doOnMouseMove = function(event){
    if (!mouseIsDown) { return };

    event.preventDefault();                 

    var endX = event.x - canvasHandler.canvas.offsetLeft;
    var endY = event.y - canvasHandler.canvas.offsetTop-50;

    // Create new Segment and add to currentLine
    let segment = new Segment(board._id,
                              currentLine._id,
                              startX, 
                              startY, 
                              endX, 
                              endY, 
                              5);
    currentLine.segments.push(segment);
    
    startX = endX;
    startY = endY;

    segment.draw(allLines);
    segment.sendToServer();
  }

  canvasHandler.canvas.addEventListener("touchmove", doOnTouchMove);
  canvasHandler.canvas.addEventListener("mousemove", doOnMouseMove);







  var doOnTouchEnd = function(event) {
    event.preventDefault();

    // Send currentLine to server
    currentLine.sendToServer();
  }

  var doOnMouseUp = function(event) {
    event.preventDefault();

    mouseIsDown = false;

    // Send currentLine to server
    currentLine.sendToServer();
  }

  canvasHandler.canvas.addEventListener("touchend", doOnTouchEnd);
  canvasHandler.canvas.addEventListener("mouseup", doOnMouseUp);





  var doOnMouseLeave = function(event) {
    event.preventDefault();

    mouseIsDown = false;
  }

  document.addEventListener("mouseleave", doOnMouseLeave);



  var clearButton = document.getElementById('clear');
  
  clearButton.onclick = function () {
    canvasHandler.sendClearCanvasRequest();
  }

  canvasHandler.clearCanvas();

  var submitUserName = function(event) {
    event.preventDefault();
    var username = $("#usernameInput").val();

    session.requestUsername(username);

  }

  $("#submitUsernameButton").click(submitUserName);
  $(".color-picker").click(function() {
    currentColor = $(this).data("value");
  })
  $("#shareToTV").click(function() {
    $("#tvCodeModal").modal('toggle');
  })
  $("#share").click(function() {
    $("#shareModal").modal('toggle');
  })
  $("#shareToTVButton").click(function() {
    socket.emit('broadcastToTV', { boardId: board._id,
                                      code: $("#codeInput").val() });
    $("#tvCodeModal").modal('toggle');
  })
  $("#shareButton").click(function() {
    socket.emit('addCollaborator', { boardId: board._id,
                                      email: $("#shareInput").val() });
    $("#shareModal").modal('toggle');
  })

  lines.forEach(function(line) {
    let newLine = new Line(line._id, line.color, line.boardId, line.username, line.segments);
    allLines[line._id] = newLine;
    newLine.draw(allLines);
  });

  socket.emit('joinRoom', { _id: board._id });

}

function setTextColor(picker) {
  currentColor = '#' + picker.toString();
}