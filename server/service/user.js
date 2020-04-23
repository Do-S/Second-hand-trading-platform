var db = require('../models/db');
const nodemailer = require('nodemailer');
var ObjectId = require('mongoose').Types.ObjectId;
const key = require('../public/key/mailKey.json')


//根据邮箱查询用户
exports.getUser = function (mail, callback) {
    db.user.findOne({ mail: mail }, function (err, docs) {
        if (err) {
            console.error(err);
        }
        return callback(docs);
    })
};

//添加用户
exports.setUser = function (mail, password, callback) {
    const saveUser = new db.user({
        mail: mail,
        password: password,
        date: new Date()
    });
    saveUser.save(function (err) {
        if (err) {
            console.error(err);
        }
        db.user.updateOne({ _id: saveUser._id }, { $set: { userId: saveUser._id } }, function (err) {
            if (err) {
                console.error(err);
            }
            return callback(err);
        });
    })
};

//获取所有用户
exports.getAllUser = function (callback) {
    db.user.find(function (err, docs) {
        if (err) {
            console.error(err);
        }
        return callback(docs);
    })
};

//发送验证码
exports.sendMail = function (mail) {
    const config = {
        // host: 'smtp.163.com',
        // port: 465,
        // auth: {
        //     user: '123.com', //注册的163邮箱账号
        //     pass: '123' //邮箱的授权码，不是注册时的密码,等你开启的stmp服务自然就会知道了
        // }

        host: 'smtp.qq.com',
        service: 'qq',
        secure: true,
        // 我们需要登录到网页邮箱中，然后配置SMTP和POP3服务器的密码
        auth: {
            user: key.mail,
            pass: key.mailPassword
        }
        
        // service: 'gmail',
        // host: 'smtp.gmail.com',
        // auth: {
        //     user: '123@gmail.com',
        //     pass: '123'
        // }
    };
    const transporter = nodemailer.createTransport(config);
    transporter.sendMail(mail, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('mail sent:', info.response);
    });
};

//修改密码
exports.changPassword = function (mail, password, callback) {
    db.user.updateOne({ mail: mail }, { $set: { password: password } }, function (err) {
        if (err) {
            console.error(err);
        }
        return callback(err);
    });
}

//储存邮箱验证码
exports.saveV_code = function (mail, v_code, callback) {
    db.mailLog.createIndexes(db.mailLogSchema.index({ createdAt: 1 }, { expires: 60 }), function (err, info) {
        if (err) console.error(err);
    });
    const saveCode = new db.mailLog({
        createdAt: new Date(),
        mail: mail,
        v_code: v_code
    });
    saveCode.save(function (err) {
        if (err) {
            console.error(err);
        }
        return callback(err);
    })
}

//查询邮箱验证码
exports.getCode = function (mail, callback) {
    db.mailLog.findOne({ mail: mail }, function (err, docs) {
        if (err) {
            console.error(err);
        }
        return callback(docs);
    })
}

//根据用户id查询用户信息
exports.getUserById = function (id, callback) {
    db.user.findOne({ _id: ObjectId(id) }, function (err, docs) {
        if (err) {
            console.error(err);
        }
        return callback(docs);
    })
}

//更新用户头像
exports.updateAvatar = function (userId, path, callback) {
    db.user.updateOne({ userId: userId }, { $set: { avatar: path } }, function (err) {
        if (err) {
            console.error(err);
        }
        return callback(err);
    });
}

//根据用户id更新用户信息
exports.updateUserById = function (userId, userList, callback) {
    console.log(userList);
    console.log(userId);
    db.user.update({ userId: userId }, {
        $set: {
            nickname: userList.nickname,
            sex: userList.sex,
            birthday: userList.birthday,
            introduction: userList.introduction
        }
    }, function (err) {
        if (err) {
            console.error(err);
        }
        return callback(err);
    });
}

//根据旧邮箱更新新邮箱
exports.updateMail = function (mail, newMail, callback) {
    db.user.update({ mail: mail }, {
        $set: {
            mail: newMail,
        }
    }, function (err) {
        if (err) {
            console.error(err);
        }
        return callback(err);
    });
}

//添加管理员
exports.addAdmin = function (user, password, callback) {
    const saveAdmin = new db.admin({
        user: user,
        password: password
    });
    saveAdmin.save(function (err) {
        if (err) {
            console.error(err);
        }
        return callback(err);
    })
}

//获取管理员
exports.getAdmin = function (user, callback) {
    db.admin.findOne({ user: user }, function (err, docs) {
        if (err) {
            console.error(err);
        }
        return callback(docs);
    })
}

//更新管理员密码
exports.updatePassword = function (user, password, callback) {
    console.log(user);
    console.log(password);
    db.admin.updateOne({ user: user }, { $set: { password: password } }, function (err) {
        if (err) {
            console.error(err);
        }
        return callback(err);
    });
}