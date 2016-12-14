class Line {
  constructor(_id, color, boardId, username, segments = []) {
    this._id = _id;
    this.color = color;
    this.boardId = boardId;
    this.username = username;
    this.segments = segments;
  }

  sendEmptyLineToServer() {
    socket.emit('newServerEmptyLine', 
                  {      '_id': this._id,
                       'color': this.color, 
                     'boardId': this.boardId, 
                    'username': this.username}
    );
  }

  sendToServer() {
    socket.emit('newServerLine', 
                  {      '_id': this._id, 
                    'segments': this.segments, 
                       'color': this.color, 
                     'boardId': this.boardId, 
                    'username': this.username}
    );
  }

  draw(allLines) {
    this.segments.forEach(function(segment) {
      segment = new Segment(segment.boardId,
                            segment.lineId,
                            segment.startX, 
                            segment.startY, 
                            segment.endX, 
                            segment.endY, 
                            segment.thickness)
      segment.draw(allLines);
    });
  }
};