var express = require('express');
var app = express();

app.disable('x-powerd-by');


var handlebars = require('express-handlebars').create({defaulLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// MORE IMPORTS
// body-parser parses your request and converts it into a format from which you can easily
// extract relevant information that you may need.
app.use(require('body-parser').urlencoded({extended: true}));

// for parsing form data, especially file uploads
var formidable = require('formidable');

// secure cookies and help with sessions
var credentials = require('./credentials.js');
app.use(require('cookie-parser')(credentials.cookieSecret));

// session
var session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

var indexRouter = require('./routes/indexRouter');

// connect to database
console.log('Connecting to database');
const Database = require("better-sqlite3");
const dbOptions = { verbose: console.log };
const dbFile = "./db/example.db"; // creates file if doesn't exist
const dbInstance = new Database(dbFile, dbOptions);
app.set('db',dbInstance);
app.locals.db = dbInstance; 

// populate db with dummy users
// db.prepare('CREATE TABLE IF NOT EXISTS users'
// + '(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)').run();
// const insert = db.prepare('INSERT INTO users (username, password) VALUES ("admin", "admin")').run();

// const insert = db.prepare('INSERT INTO friends (name, age) VALUES (@name, @age)');

// const insertMany = db.transaction((friends) => {
// for (const friend of friends) insert.run(friend);
// });

// insertMany([
// { name: 'Donald', age: 23 },
// { name: 'Micky', age: 24 },
// { name: 'Goofy', age: 25 },
// ]);

// const getUserFromDB = db.transaction((user) => {
// stmtGetUser.get(user).username;
// });


// set port '3000'
app.set('port', process.env.PORT || 8000);

// make files in folder "public" accessible to express
// __dirname is equal to the server filepath ($HOME/...)
app.use(express.static(__dirname + '/public'));

//////////////////////////////////////////////////
// Define routes
app.use('/', indexRouter);


app.listen(app.get('port'), function(){
    console.log("Express started on localhost:" + app.get('port') + " press Ctr-C to terminate");
});
