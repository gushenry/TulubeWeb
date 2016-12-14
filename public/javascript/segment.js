class Segment {
  constructor(boardId, lineId, startX, startY, endX, endY, thickness) {
    this.boardId = boardId;
    this.lineId = lineId;
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.thickness = thickness;
  }

  sendToServer() {
    socket.emit('newServerSegment', 
                { 'boardId': this.boardId,
                   'lineId': this.lineId,
                   'startX': this.startX, 
                   'startY': this.startY, 
                     'endX': this.endX, 
                     'endY': this.endY,
                'thickness': this.thickness }
    );
  }

  draw(allLines) {
    canvasHandler.context.beginPath();
    canvasHandler.context.moveTo(this.startX, this.startY);
    canvasHandler.context.lineTo(this.endX, this.endY);
    canvasHandler.context.strokeStyle = allLines[this.lineId].color;
    canvasHandler.context.lineWidth = this.thickness;
    canvasHandler.context.stroke();
    canvasHandler.context.closePath();
  }

};