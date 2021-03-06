var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var multer = require('multer')().single();

var Room = require("./Room");

//for form url endcoded
router.use(bodyParser.urlencoded({
    extended: true
}));

//for raw json
router.use(bodyParser.json());

//for form data
router.use(multer);

router.get("/createLobby", (req, res) => {
    for (var i = 0; i < 6; i++) {
        var lobby = {
            name: 'Phòng ' + (i + 1),
            type: 'CO_TUONG'
        }
        Room.createNewLobby(lobby, (error, results, next) => {});
    }
    res.send({
        success: true
    })
});

router.get("/createRoom", (req, res) => {
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 90; j++) {
            var room = {
                name: 'Bàn ' + (j + 1),
                lobby_id: i
            }
            Room.createNewRoom(room, (error, results) => {
                console.log(error);
            });
        }
    }
    res.send({
        success: true
    })
});

router.get("/all/:type", (req, res) => {
    Room.allLobby(req.params.type, (error, results) => {
        if (error || results == null || results.length == 0) {
            res.send({
                success: false,
                message: "Không lấy được danh sách phòng chơi"
            });
        } else {
            res.send({
                success: true,
                data: results
            })
        }
    });
});

router.get("/table/:lobbyId", (req, res) => {
    Room.allRoom(req.params.lobbyId, (error, results) => {
        if (error || results == null || results.length == 0) {
            res.send({
                success: false,
                message: "Không lấy được danh sách phòng chơi"
            });
        } else {
            res.send({
                success: true,
                data: results
            })
        }
    });
});

module.exports = router;