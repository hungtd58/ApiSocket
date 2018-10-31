var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer')().single();

var http = require('http').Server(app);
var io = require('socket.io')(http);

//for form url endcoded
app.use(bodyParser.urlencoded({
    extended: true
}));

//for raw json
app.use(bodyParser.json());

//for form data
app.use(multer);

var userController = require('./db/user/UserController');
var roomController = require('./db/room/RoomController');

app.use("/auth/", userController);
app.use("/room/", roomController);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

var usersInLobby = [];

io.on('connection', function (socket) {
    console.log('A user connected');

    socket.on("send-info", (data) => {
        var user = {
            socket_id: socket.id,
            id: data.id,
            username: data.username,
            levels: data.levels,
            hasMatch: false
        }
        if (socket.id != null &&  !containsUser(user, usersInLobby)) {
            usersInLobby.push(user);
        }

        socket.emit("receive-info", true);
    })

    socket.on("find-match", (data) => {
        console.log("Find Match: " + usersInLobby.length);
        var item;
        for (item in usersInLobby) {
            console.log("Id1: " + item.socket_id);
            console.log("Id2: " + socket.id);
            if (item.socket_id == socket.id || item.hasMatch){
                continue;
            }
            var room = socket.id + "-" + item.socket_id;
            socket.emit("match", room);
            io.to(item.socket_id).emit("match", room);
            break;
        }
    });

    socket.on("join-match", (room) => {
        console.log("Join Match");
        socket.join(room);
    });
});

var server = http.listen(3000, function () {
    console.log('Server listening on port ' + server.address().port);
});

function containsUser(user, lobby) {
    var item;
    for (item in lobby) {
        if (item.socket_id == user.socket_id) {
            return true;
        }
    }
    return false;
}

/*
let timerId = setTimeout(function match() {
    var matchs = [];
    var item;
    var countInMatch = 0;
    for (item in usersInLobby) {
        if (item.hasMatch) continue;
        if (countInMatch == 0) {
            var match = {
                player1: item,
                player2: null
            }

            matchs.push(item);
            countInMatch = 1;
        } else {
            var match = matchs[matchs.length - 1];
            match.player2 = item;
            countInMatch = 0;
        }
        item.hasMatch = true;
    }

    for (match in matchs) {
        if (match.player1 == null || match.player2 == null) {
            continue;
        }
        var room = match.player1.socket_id + "-" + match.player2.socket_id;
        io.to(match.player1.socket_id).emit("match", room);
    }

    timerId = setTimeout(match, 2000);
}, 2000);
*/