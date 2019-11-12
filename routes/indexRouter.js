var express = require('express');
var router = express.Router();

var dbQuery = require('../public/js/dbQueries.js');

// print which routes were taken to stdout
router.use(function(req, res, next){
    console.log("Looking for URL : " + req.url);
    next();
});

router.get('/', function(req, res){
    if (req.session.loggedin) {
        res.render('profile');
    } else {
        res.render('home', {style: 'home.css', script: 'layout_position.js'});
    }
});

// determines the front page action
router.post('/standort', function(req,res){
});

router.get('/contact', function(req, res){
    res.render('contact', { csrf: 'CSRF token here'});
});


router.post('/process', function(req,res){
    console.log('Form : ' + req.query.form);
    console.log('CSRF token : ' + req.body._csrf);
    console.log('Email : ' + req.body.email);     // as defined in contact.handlebar
    console.log('Question : ' + req.body.ques);   // as defined in contact.handlebar
    res.redirect(303, '/thankyou');
});

router.get('/thankyou', function(req, res){
    res.render('thankyou');
});


router.get('/login', function(req, res){
    res.render('login', { csrf: 'CSRF token here'});
});


router.post('/login', function(req,res){
    console.log('Form : ' + req.query.form);
    console.log('CSRF token : ' + req.body._csrf);
    console.log('Username : ' + req.body.loginUser);     // as defined in contact.handlebar
    console.log('Password : ' + req.body.loginPass);   // as defined in contact.handlebar

    var username = req.body.loginUser;
    var password = req.body.loginPass;
    var userExists = dbQuery.checkUserAndPassword(req,username,password)

    if (username && password) {
        if (typeof userExists !== "undefined") {
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect('/');
        } else {
            req.flash('error_msg', 'Incorrect Username and/or Password!');
            res.redirect('/login');
        }
    } else {
        req.flash('error_msg', 'Please enter Username and Password!');
        res.redirect('/login');

    }
});

router.get('/logout', function(req, res){
    // kill session and redirect to login page if user is logged in
    if (req.session.loggedin) {
        req.session.destroy();
        res.redirect('/login');
    }
    else{
        res.redirect('/login');
    }

});


// Handle errors
// redirect 404 erros to 404.handlebar
router.use(function(req, res){
    res.type('text/html');
    res.status(404);
    res.render('404');
});

router.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

module.exports = router;
