var express = require('express');
var app = express();
app.use(express.json())

app.disable('x-powerd-by');


// REQUIRE
var handlebars = require('express-handlebars').create({defaulLayout:'main'});
var formidable = require('formidable');
var flash = require('connect-flash');
var bodyParser = require('body-parser')

// ROUTES
var indexRouter = require('./routes/indexRouter');

// use template engine 
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// parses requests, converts into a format you can easily extract information
app.use(bodyParser.urlencoded({extended: true}));

// secure cookies and help with sessions
var credentials = require('./credentials.js');
app.use(require('cookie-parser')(credentials.cookieSecret));

// SESSION
var session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

// connect flash
app.use(flash());

// some global variables
app.use(function (req,res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


// DATABASE CONNECTION
console.log('Connecting to database');
const Database = require("better-sqlite3");
const dbOptions = { verbose: console.log };
const dbFile = "./db/example.db"; // creates file if doesn't exist
const dbInstance = new Database(dbFile, dbOptions);

// stores a named property on the app object that can be retrieved later with app.get()
app.set('db',dbInstance);
app.locals.db = dbInstance; 


// SET PORT '3000'
app.set('port', process.env.PORT || 8000);

// make files in folder "public" accessible to express
// __dirname is equal to the server filepath ($HOME/...)
app.use(express.static(__dirname + '/public'));

// use routes
app.use('/', indexRouter);


app.listen(app.get('port'), function(){
    console.log("Express started on localhost:" + app.get('port') + " press Ctr-C to terminate");
});

module.exports = app;
