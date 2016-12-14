// var width;
// var height;

// if ($(window).width() < 900 || $(window).height() < 650) {
//   width = 450;
//   height = 300;
// } else {
//   width = 900;
//   height = 600;
// }

// var newCanvas = 
//   $('<canvas/>',{'id':'main'})
//   .width(width)
//   .height(height);
// $('#canvasDiv').append(newCanvas);

class CanvasHandler {
  constructor() {
    this.canvas = document.getElementById('main');
    this.context = this.canvas.getContext("2d");

    this.context.strokeStyle = "#000000";
    this.context.lineCap = 'round';
    this.context.lineJoin = 'round';
    this.context.lineWidth = 5;
  }

  sendClearCanvasRequest() {
    socket.emit('requestCanvasCleared', { boardId: board._id });
  }

  clearCanvas() {
    this.context.fillStyle = "#ffffff";
    this.context.rect(0, 0, 900, 600);
    this.context.fill();
  }
};

var canvasHandler = new CanvasHandler();