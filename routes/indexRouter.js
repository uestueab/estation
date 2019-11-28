var express = require('express');
var router = express.Router();

var dbQuery = require('../public/js/dbQueries.js');
var app = require('../app');
const geolib = require('geolib');



// print which routes were taken to stdout
router.use(function(req, res, next){
    console.log("Looking for URL : " + req.url);
    next();
});

router.get('/', function(req, res){
    if (req.session.loggedin) {
        res.redirect('/dashboard');
    } else {
        res.render('home', {style: 'home.css', script: 'geolocation.js'});
    }
});



router.post('/', function(req, res){
    // Get location of the user and define them globally
    // so they become accessible to all routes
    global.userLat = req.body.lat;
    global.userLon = req.body.lon;
});

// determines the front page action
router.post('/standort', function(req,res){
    var chosenKraftstoff = req.body.chosenKraftstoff;
    var chosenGasStations = dbQuery.getGasStationByType(req,chosenKraftstoff);

    // console.log(userLat,userLon);

    var gasStations = [];

    // populate gasStations array with jsons, where each json is a gas station
    // with the distance to the users location
    for (i in chosenGasStations){
        var lat = chosenGasStations[i].lat;
        var lon = chosenGasStations[i].lon;

        // calculate the distance and round to 2 decimal places 
        var distance = geolib.getDistance({ latitude: userLat, longitude: userLon, },{ latitude: lat, longitude: lon})/1000;
        var distance = distance.toFixed(1);

        gasStations.push({
            operator: chosenGasStations[i].operator,
            kraftstofftyp: chosenGasStations[i].kraftstofftyp,
            stadt: chosenGasStations[i].stadt,
            entfernung: distance
        });
    };

    // sort ascending
    gasStations.sort(function(a, b) {
        return parseFloat(a.entfernung) - parseFloat(b.entfernung);
    });

    res.render('home', {style: 'home.css', tankstellen: gasStations});
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
    res.render('login', {style: 'login.css', csrf: 'CSRF token here'});
});


router.post('/login', function(req,res){
    console.log('Form : ' + req.query.form);
    console.log('CSRF token : ' + req.body._csrf);
    console.log('Username : ' + req.body.loginUser);     
    console.log('Password : ' + req.body.loginPass);   

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

router.get('/dashboard', function(req,res){

    if (req.session.loggedin) {

        var allStations = dbQuery.getAllGasStations(req);
        res.render('dashboard', {style: 'dashboard.css', tankstellen: allStations});
    }
    else {
        res.redirect('/');
    }
});

router.post('/dashboard', function(req,res){
    
    var deleteRow = req.body.deleteRow;
    var insertRow = req.body.insertRow;



    if (deleteRow){
        if(dbQuery.deleteRow(req,deleteRow) == 0){
            req.flash('error_msg', 'ERROR: No rows were deleted, please enter a valid ID');
            res.redirect('/dashboard');
        }
        else{
            req.flash('success_msg', 'SUCCESS: Row with ID=' + deleteRow + ' has been deleted');
            res.redirect('/dashboard');
        }
    }

    if (insertRow){
        var values = insertRow.split(',');

        if(dbQuery.insertRow(req,values) == 0){
            req.flash('error_msg', 'ERROR: No rows were inserted, please check your values');
            res.redirect('/dashboard');
        }
        else{
            req.flash('success_msg', 'SUCCESS: Row with ID=' + values[0] + ' has been inserted');
            res.redirect('/dashboard');
        }
    }
    
// if (insertRow){
// if(dbQuery.deleteRow(req,deleteRow) == 0){
// req.flash('error_msg', 'ERROR: No rows were deleted, please enter a valid ID');
// res.redirect('/dashboard');
// }
// else{
// req.flash('success_msg', 'SUCCESS: Row has been deleted');
// res.redirect('/dashboard');
// }
// }
});

module.exports = router;
