class Session {
  constructor() {
    this.username;
    this.db;
  }

  requestUsername(username) {
    socket.emit('newUsernameRequest', {'username': username});
  }

};

var session = new Session();
