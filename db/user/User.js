var db = require("../Dbconnection.js");

var User = {
    register: (user, callback) => {
        return db.query("INSERT INTO users SET ?", user, callback);
    },

    login: (user, callback) => {
        return db.query("SELECT * FROM users WHERE username = ? AND password = ?",
            [user.username, user.password], callback);
    },

    insertToken: (id, token, callback) => {
        return db.query("UPDATE users SET token = ? WHERE id = ?", 
            [token, id], callback);
    }
}

module.exports = User;