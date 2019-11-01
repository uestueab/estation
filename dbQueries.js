var express = require('express');

module.exports.checkUserAndPassword = function(request ,username, password) {
    return request.app.get('db').prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username,password) 
}

