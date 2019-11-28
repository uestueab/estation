var express = require('express');

// select the record where password and username match
module.exports.checkUserAndPassword = function(request ,username, password) {
    return request.app.get('db').prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username,password);
}

module.exports.getGasStationByType = function(request ,kraftstoff) {
    return request.app.get('db').prepare('SELECT * FROM tankstellen WHERE kraftstofftyp = ?').all(kraftstoff);
}

module.exports.getAllGasStations = function(request) {
    return request.app.get('db').prepare('SELECT * FROM tankstellen').all();
}

module.exports.deleteRow = function(request, id) {
    var info  = request.app.get('db').prepare('DELETE FROM tankstellen WHERE tankstellen_id = ?').run(id);

    // info.changes: the total number of rows that were inserted, updated, or deleted by this operation
    // see better-sqlite3 documentation
    return info.changes;
}

module.exports.insertRow = function(request, values) {
    var info  = request.app.get('db').prepare('INSERT INTO tankstellen\
    (tankstellen_id, operator,kraftstofftyp,stadt,lat,lon) VALUES (?,?,?,?,?,?)').run(
    values[0],
    values[1],
    values[2],
    values[3],
    values[4],
    values[5],
    );

    // info.changes: the total number of rows that were inserted, updated, or deleted by this operation
    // see better-sqlite3 documentation
    return info.changes;
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

