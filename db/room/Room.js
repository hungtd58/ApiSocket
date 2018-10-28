var db = require("../Dbconnection");

var Room = {
    createNewLobby: (lobby, callback) => {
        return db.query("INSERT INTO lobby SET ?", lobby, callback);
    },

    createNewRoom: (room, callback) => {
        return db.query("INSERT INTO rooms SET ?", room, callback);
    }
}

module.exports = Room;