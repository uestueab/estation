var express = require('express');

// select the record where password and username match
module.exports.checkUserAndPassword = function(request ,username, password) {
    return request.app.get('db').prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username,password) 
}

module.exports.getGasStationByType = function(request ,kraftstoff) {
    return request.app.get('db').prepare('SELECT * FROM tankstellen WHERE kraftstofftyp = ?').all(kraftstoff) 
}

module.exports.getAllGasStations = function(request) {
    return request.app.get('db').prepare('SELECT * FROM tankstellen').all() 
}



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

