// app/routes.js

var Board = require('./models/board.js')
var Line = require('./models/line.js')
var User = require('./models/user.js')
var ObjectID = require('mongodb').ObjectID

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        // res.render('index.ejs'); // load the index.ejs file
        res.redirect('/login');
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/boards', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/api/login', function(req, res) {

        User.findOne({ 'local.email' :  req.body.email.toLowerCase() }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err) {
                console.log(err);
                res.sendStatus(500);
            }
            // if no user is found, return the message
            else if (!user) {
                res.sendStatus(404);
            }

            // if the user is found but the password is wrong
            else if (!user.validPassword(req.body.password)) {
                res.sendStatus(404);
            }

            else {
                res.sendStatus(200);
            }
        });
        }
    );

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/whiteboard', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/api/signup', function(req, res) {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  req.body.email.toLowerCase() }, function(err, user) {
            // if there are any errors, return the error
            if (err) {
                console.log(err);
                res.sendStatus(500);
            }

            // check to see if theres already a user with that email
            else if (user) {
                res.sendStatus(409);
            } 

            else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.email    = req.body.email.toLowerCase();
                newUser.local.password = newUser.generateHash(req.body.password);

                // save the user
                newUser.save(function(err) {
                    if (err) {
                        res.sendStatus(500);
                        throw err;
                    } else {
                        res.sendStatus(201);
                    }
                });
            }

        });

        }
    );

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // WHITEBOARD ==========================
    // =====================================
    app.get('/whiteboard', isLoggedIn, function(req, res) {
        res.render('whiteboard.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // ALL-BOARDS ==========================
    // =====================================
    app.get('/boards', isLoggedIn, function(req, res) {
        var query = Board.find().or([{ creator: req.user.local.email.toLowerCase() }, { collaborators: req.user.local.email }]);
        // Board.find( { creator: req.user.local.email }, function(err, boards) {
        query.exec(function(err, boards) {
            if (err) {
                console.log(err);
            } else {
                res.render('boards.ejs', {
                    user : req.user, // get the user out of session and pass to template
                    boards: boards
                });
            }
        })
    });

    app.get('/api/boards', function(req, res) {

        User.findOne({ 'local.email' :  req.query.email.toLowerCase() }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err) {
                res.sendStatus(500);
            }
            // if no user is found, return the message
            else if (!user) {
                res.sendStatus(404);
            }

            // if the user is found but the password is wrong
            else if (!user.validPassword(req.query.password)) {
                res.sendStatus(404);
            }

            else {
                var query = Board.find().or([{ creator: req.query.email.toLowerCase() }, { collaborators: req.query.email }]);
                // Board.find( { creator: req.user.local.email }, function(err, boards) {
                query.exec(function(err, boards) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.json(boards);
                    }
                })
            }
        });
    });

    app.get('/boards/:objectid', isLoggedIn, function(req, res) {
        Board.findById(req.params.objectid, function(err, board) {
            if (err) {
                res.redirect('/boards');
            } else {
                Line.find({ "boardId": req.params.objectid }, function(err, lines) {
                    if (err) {
                        console.log(err);
                        res.redirect('/boards');
                    } else {
                        res.render('whiteboard.ejs', {
                            user : req.user,
                            board: board,
                            lines: lines
                        });
                    }
                })
            }
        })
    });

    app.get('/api/boards/:objectid', function(req, res) {

        User.findOne({ 'local.email' :  req.query.email.toLowerCase() }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err) {
                console.log(err);
                res.sendStatus(500);
            }
            // if no user is found, return the message
            else if (!user) {
                res.sendStatus(404);
            }

            // if the user is found but the password is wrong
            else if (!user.validPassword(req.query.password)) {
                res.sendStatus(404);
            }

            else {

                Board.findById(req.params.objectid, function(err, board) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                    } else {
                        Line.find({ "boardId": req.params.objectid }, function(err, lines) {
                            if (err) {
                                console.log(err);
                                res.sendStatus(500);
                            } else {
                                res.json(lines);
                            }
                        })
                    }
                })
                
            }
        });
    });

    app.post('/new-board', isLoggedIn, function(req, res) {
        var board = new Board({
            title: req.body.title,
            creator: req.user.local.email
        });
        board.save(function(err, data) {
          if (err) {
              console.log(err);
              res.redirect('/boards');
            } else {
                res.redirect('/boards/' + data._id);
            }
        })
    });


    app.post('/api/new-board', function(req, res) {

        User.findOne({ 'local.email' :  req.body.email.toLowerCase() }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err) {
                console.log(err);
                res.sendStatus(500);
            }
            // if no user is found, return the message
            else if (!user) {
                res.sendStatus(404);
            }

            // if the user is found but the password is wrong
            else if (!user.validPassword(req.body.password)) {
                res.sendStatus(404);
            }

            else {
                var board = new Board({
                    title: req.body.title,
                    creator: req.body.email
                });
                board.save(function(err, data) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                    }
                })
            }
        });
    });

    app.post('/api/image', function(req, res) {

        User.findOne({ 'local.email' :  req.body.email.toLowerCase() }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err) {
                console.log(err);
                res.sendStatus(500);
            }
            // if no user is found, return the message
            else if (!user) {
                res.sendStatus(404);
            }

            // if the user is found but the password is wrong
            else if (!user.validPassword(req.body.password)) {
                res.sendStatus(404);
            }

            else {
                var board = new Board({
                    title: req.body.title,
                    creator: req.body.email
                });
                board.save(function(err, data) {
                  if (err) {
                      console.log(err);
                      res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                    }
                })
            }
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}