var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var multer = require('multer')().single();

var User = require("./User");
var crypto = require("crypto");

//for form url endcoded
router.use(bodyParser.urlencoded({
    extended: true
}));

//for raw json
router.use(bodyParser.json());

//for form data
router.use(multer);

router.post("/register", (req, res) => {
    var user = {
        username: req.body.username,
        password: req.body.password,
        created: new Date()
    }

    User.register(user, (error, rows) => {
        if (error) {
            res.send({
                code: 400,
                success: false,
                message: "Tài khoản đã được sử dụng. Vui lòng chọn tên tài khoản khác"
            });
        } else {
            res.send({
                code: 200,
                success: true,
                message: "Đăng ký thành công"
            });
        }
    })
});

router.post("/login", (req, res) => {
    var user = {
        username: req.body.username,
        password: req.body.password
    }

    User.login(user, (error, rows) => {
        console.log(rows);
        if (error || rows == null || rows.length == 0) {
            res.send({
                code: 400,
                success: false,
                message: "Sai tài khoản hoặc mật khẩu"
            });
        } else {
            var userRow = rows[0];
            loginSuccess(userRow)
                .then(insertToken)
                .then((token) => {
                    var data = {
                        id: userRow.id,
                        username: userRow.username,
                        token: token,
                        created: userRow.created
                    }
                    res.send({
                        code: 200,
                        success: true,
                        data: data
                    });
                })
                .catch((reason) => {
                    res.send({
                        cod: 400,
                        success: false,
                        message: "Có lỗi xảy ra, vui lòng liên hệ với admin@h2bros.com để được hỗ trợ!"
                    });
                });
        }
    });
});

function loginSuccess(user) {
    return new Promise((resolve, reject) => {
        if (user.token == null || user.token.length == 0) {
            console.log("Token null");
            crypto.randomBytes(48, function (err, buffer) {
                if (err) {
                    reject("Có lỗi xảy ra. Vui lòng thử lại");
                } else {
                    var token = buffer.toString('hex');
                    console.log(token);
                    return resolve([user, token]);
                }
            });
        } else {
            console.log("Token not null");
            return resolve([user, user.token]);
        }
    });
}

function insertToken([user, token]) {
    return new Promise((resolve, reject) => {
        console.log(user.id + " - " + token);
        User.insertToken(user.id, token, (error, rows) => {
            if (error) {
                reject("Có lỗi xảy ra.Vui lòng thử lại");
            } else {
                return resolve(token);
            }
        });
    });
}

module.exports = router;