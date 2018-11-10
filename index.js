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

app.use("/auth/", userController);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

var server = app.listen(3000, function () {
    console.log('Listening on port %d', server.address().port);
});