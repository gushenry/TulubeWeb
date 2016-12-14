// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path     = require('path')

var http = require('http').Server(app)
var io = require('socket.io')(http)
var socket = require('./config/socket.js').init(io)

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.Promise = global.Promise;
mongoose.connect(configDB.url); // connect to our database

// var db = mongoose.connection;

// db.on('error', function (err) {
//   console.log('db connection error', err);
// });
// db.once('open', function () {
//   console.log('connected to db.');
// });

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: true }));// get information from html forms
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating

// app.set('port', port)

// serve static files
app.use(express.static(path.join(__dirname, '/public')));
// app.use(express.static('public'));
app.use('/javascript', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/javascript', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/style', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/fonts', express.static(__dirname + '/node_modules/bootstrap/fonts')); // redirect CSS bootstrap

// app.use((req, res) => { res.redirect('/') })

// required for passport
app.use(session({
  secret: 'ilovescotchscotchyscotchscotch', // session secret
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// app.use(app.router);
// var routes = require('./app/routes.js').init(app)

// launch ======================================================================
// app.listen(port);
// console.log('The magic happens on port ' + port);

// Start Application
http.listen(port, () => {
    console.log("Server started on port " + port)
})

// io.listen(http)