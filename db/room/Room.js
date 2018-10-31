var db = require("../Dbconnection");

var Room = {
    createNewLobby: (lobby, callback) => {
        return db.query("INSERT INTO lobby SET ?", lobby, callback);
    },

    createNewRoom: (room, callback) => {
        return db.query("INSERT INTO rooms SET ?", room, callback);
    },

    allLobby: (type, callback) => {
        return db.query("SELECT * FROM lobby WHERE type = ?", type, callback);
    },

    allRoom: (lobbyId, callback) => {
        return db.query("SELECT * FROM rooms WHERE lobby_id = ?", lobbyId, callback);
    }
}

module.exports = Room;