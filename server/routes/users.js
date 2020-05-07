var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var user = require('../service/user');
var jwt = require('jsonwebtoken');
var svgCaptcha = require('svg-captcha');
const key = require('../public/key/mailKey.json')
const NodeRSA = require('node-rsa')
var publicKey = fs.readFileSync(path.join(__dirname, '../public/key/pub.key')).toString();
var privateKey = fs.readFileSync(path.join(__dirname, '../public/key/pri.key')).toString();
var priKey = new NodeRSA(privateKey);
var pubKey = new NodeRSA(publicKey);
priKey.setOptions({ encryptionScheme: 'pkcs1' });
pubKey.setOptions({ encryptionScheme: 'pkcs1' })

/* GET users listing. */
//用户登录
router.post('/login', function (req, res, next) {
  var usermail = req.body.mail;
  var password = priKey.decrypt(req.body.password, 'utf8');
  user.getUser(usermail, function (result) {
    if (result) {
      if (priKey.decrypt(result.password, 'utf8') == password) {
        let content = { usermail: usermail };  // 要生成token的主题信息
        let secretKey = "This is perfect projects.";
        let token = jwt.sign(content, secretKey, {
          expiresIn: 60 * 60 * 5  // 授权时效5小时
        });
        console.log(result._id);
        const data = {
          "token": 'Bearer' + ' ' + token,
          "status": 200,
          "userId": result._id
        }
        req.session.name = usermail;
        res.json(data);
      } else {
        const data = {
          status: 300,
        }
        res.json(data);
      }
    } else {
      const data = {
        status: 404,
      }
      res.json(data);
    }
  });
});

//用户注册
router.post('/register', function (req, res, next) {
  var usermail = req.body.mail;
  var password = req.body.password;
  var v_code = req.body.v_code;
  user.getCode(usermail, function (result) {
    if (result.v_code == v_code) {
      user.getUser(usermail, function (reData) {
        if (!reData) {
          user.setUser(usermail, password, function (err) {
            if (err) {
              const data = {
                text: "注册失败",
                status: 404,
              }
              res.json(data);
            } else {
              const data = {
                status: 200,
                text: "注册成功",
              }
              res.json(data);
            }
          });
        } else {
          const data = {
            status: 500,
            text: "该用户已注册",
          }
          res.json(data);
        }
      })
    } else {
      const data = {
        status: 300,
        text: "验证码错误",
      }
      res.json(data);
    }
  })
});

//获取公钥
router.get('/key', function (req, res, next) {
  res.json(publicKey);
});

//获取图片验证码
router.get('/getCode', function (req, res, next) {
  var codeConfig = {
    size: 5,// 验证码长度
    ignoreChars: '0o1i', // 验证码字符中排除 0o1i
    noise: 5, // 干扰线条的数量
    height: 44,
    // background: '#cc9966' ,
    color: true
  }
  var captcha = svgCaptcha.create(codeConfig);
  req.session.captcha = captcha.text.toLowerCase(); //存session用于验证接口获取文字码
  let data = {
    test: captcha.data,
    code: captcha.text.toLowerCase()
  }
  res.cookie('captcha', req.session.captcha);
  res.json(data);
})

//获取邮箱验证码
router.get('/mail', function (req, res, next) {
  const getMail = req.query.mail;
  var Num = "";
  for (var i = 0; i < 6; i++) {
    Num += Math.floor(Math.random() * 10);
  }
  var mail = {
    // 发件人
    from: key.mail,
    //抄送
    cc: key.mail,
    // 收件人
    to: getMail,//前台传过来的邮箱
    // 主题
    subject: '邮箱验证码',//邮箱主题
    // 邮件内容，HTML格式
    text: "尊敬的用户您好,您本次注册的验证码是:" + Num //发送验证码
  };
  user.saveV_code(getMail, Num, function (err) {
    if (err) {
      console.log('验证码保存失败')
    } else {
      user.sendMail(mail);//发送邮件
      console.log('验证码保存成功')
      res.json({ status: 200 })
    }
  })
})

//验证数据库中是否含有该邮箱
router.get('/findMail', function (req, res, next) {
  const mail = req.query.mail;
  console.log(mail)
  user.getUser(mail, function (result) {
    if (result) {
      const data = {
        status: 200
      }
      res.json(data);
    } else {
      const data = {
        status: 404
      }
      res.json(data);
    }
  })
});

//验证邮箱验证码是否正确
router.post('/findCode', function (req, res, next) {
  const v_code = priKey.decrypt(req.body.v_code, 'utf8');
  const mail = req.body.mail;
  user.getCode(mail, function (result) {
    if (result) {
      if (result.v_code == v_code) {
        const data = {
          status: 200
        }
        res.json(data);
      } else {
        const data = {
          status: 300
        }
        res.json(data);
      }
    } else {
      const data = {
        status: 404
      }
      res.json(data);
    }
  })
});

//修改密码
router.post('/changePassword', function (req, res, next) {
  const mail = req.body.mail;
  const password = req.body.password;
  user.changPassword(mail, password, function (err) {
    if (err) {
      const data = {
        status: 404,
        text: '修改失败'
      }
      res.json(data);
    } else {
      const data = {
        status: 200,
        text: '修改成功'
      }
      res.json(data);
    }
  })
})

//根据旧密码修改密码
router.post('/changePasswordByOld', function (req, res, next) {
  const mail = req.body.mail;
  const oldPassword = priKey.decrypt(req.body.oldPassword, 'utf8');
  const password = req.body.password;
  user.getUser(mail, function (result) {
    if (priKey.decrypt(result.password, 'utf8') == oldPassword) {
      user.changPassword(mail, password, function (err) {
        if (err) {
          const data = {
            status: 404,
            text: '修改失败'
          }
          res.json(data);
        } else {
          const data = {
            status: 200,
            text: '修改成功'
          }
          res.json(data);
        }
      })
    } else {
      const data = {
        status: 500,
        text: '密码错误'
      }
      res.json(data);
    }
  });
})

//根据用户id查找用户信息;
router.post('/getUserById', function (req, res, next) {
  let id = req.body.id;
  user.getUserById(id, function (result) {
    res.json(result);
  })
})

//根据用户id更新用户信息
router.post('/updateUser', function (req, res, next) {
  let userId = req.body.userId;
  let userList = req.body.userList;
  user.updateUserById(userId, userList, function (err) {
    if (err) {
      const data = {
        status: 404,
        text: '修改失败'
      }
      res.json(data);
    }
    const data = {
      status: 200,
      text: '修改成功'
    }
    res.json(data);

  })
})

//根据邮箱更改新邮箱
router.post('/updateMail', function (req, res, next) {
  let mail = req.body.mail;
  let newMail = req.body.newMail;
  let v_code = req.body.v_code;
  user.getCode(mail, function (data) {
    if (data.v_code == v_code) {
      user.getUser(mail, function (result) {
        if (mail) {
          const data = {
            status: 300,
            text: '该邮箱已经存在'
          }
          res.json(data);
        } else {
          user.updateMail(mail, newMail, function (err) {
            if (err) {
              const data = {
                status: 404,
                text: '更新失败'
              }
              res.json(data);
            };
            const data = {
              status: 200,
              text: '更新成功'
            }
            res.json(data);
          })
        }
      })
    }
  })
})

module.exports = router;
