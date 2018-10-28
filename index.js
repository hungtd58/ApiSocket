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

io.on('connection', function (socket) {
    console.log('A user connected');

    socket.on("user-info", (data) => {
        username = data.username;
    });
});

var server = http.listen(3000, function () {
    console.log('Server listening on port ' + server.address().port);
});