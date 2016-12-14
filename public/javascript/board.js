class Board {
  constructor(_id, title, creator) {
    this._id = _id;
    this.title = title;
    this.creator = creator;
  }

  static getBoards() {
    socket.emit('getBoardsForUser', 
      { 'username': session.username }
    );
  }

  static loadBoards(boards) {
    // $("#boardsTableBody").append('<tr><th scope="row">1</th><td>Mark</td></tr>');
    console.log(boards);
    $("#boardsTableBody").append(`
      <tr>
        <th scope="row">
          ${expression}
        </th>
        <td>
          ${expression}
        </td>
      </tr>
    `);
  }

  sendToServer() {
    socket.emit('newServerBoard', 
                  {      '_id': this._id,
                       'title': this.title,
                     'creator': this.creator}
    );
  }
};