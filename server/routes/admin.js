var express = require('express');
var router = express.Router();
const axios = require('axios');
var path = require('path');
var fs = require('fs');
var user = require('../service/user');
var goods = require('../service/goods');
var jwt = require('jsonwebtoken');
const NodeRSA = require('node-rsa')
var publicKey = fs.readFileSync(path.join(__dirname, '../public/key/pub.key')).toString();
var privateKey = fs.readFileSync(path.join(__dirname, '../public/key/pri.key')).toString();
var priKey = new NodeRSA(privateKey);
var pubKey = new NodeRSA(publicKey);
priKey.setOptions({ encryptionScheme: 'pkcs1' });
pubKey.setOptions({ encryptionScheme: 'pkcs1' })

//管理员登录
router.post('/login', function (req, res, next) {
    let userName = req.body.user;
    let password = req.body.password;
    user.getAdmin(userName, function (result) {
        if (result) {
            if (password == result.password) {
                let content = { userName: userName };  // 要生成token的主题信息
                let secretKey = "This is perfect projects.";
                let token = jwt.sign(content, secretKey, {
                    expiresIn: 60 * 60 * 5  // 授权时效5小时
                });
                const data = {
                    "token": 'Bearer' + ' ' + token,
                    "status": 200,
                    "userId": userName
                }
                res.json(data);
            } else {
                const data = {
                    status: 404,
                    text: '密码错误'
                }
                res.json(data);
            }
        } else {
            const data = {
                status: 300,
                text: '该用户未注册'
            }
            res.json(data);
        }
    })
})

//管理员注册
router.post('/register', function (req, res, next) {
    let userName = req.body.user;
    let password = req.body.password;
    user.addAdmin(userName, password, function (err) {
        res.type('html');
        res.render('index', {
            status: 200
        })
    })
})

//修改管理员密码
router.post('/updatePassword', function (req, res, next) {
    let userName = req.body.user;
    let password = req.body.password;
    let newPassword = req.body.newPassword;
    user.getAdmin(userName, function (result) {
        if (result) {
            console.log(result);
            if (result.password == password) {
                user.updatePassword(userName, newPassword, function (err) {
                    if (err) {
                        const data = {
                            status: 500,
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
            } else {
                const data = {
                    status: 404,
                    text: '密码错误'
                }
                res.json(data);
            }
        } else {
            const data = {
                status: 300,
                text: '用户不存在'
            }
            res.json(data);
        }
    })
})

//根据日期获取商品交易信息
router.get('/getGoodsByDate', function (req, res, next) {
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    goods.getGoodsByDate(fromDate, toDate, function (result) {
        res.json(result);
    })
})

//根据卖家查询交易信息
router.get('/getGoodsBySeller', function (req, res, next) {
    let sellerMail = req.query.sellerMail;
    user.getUser(sellerMail, function (count) {
        if (count) {
            goods.getGoodsBySeller(sellerMail, function (result) {
                res.json(result);
            })
        } else {
            res.json(count);
        }
    })
})

//获取过去七日交易额
router.get('/getDailyTurnover', function (req, res, next) {
    goods.getDailyTurnover(function (result) {
        res.json(result);
    })
})

//获取过去12个月交易额
router.get('/getMonthlyTransaction', function (req, res, next) {
    goods.getMonthlyTransaction(function (result) {
        res.json(result);
    })
})

//获取过去七日交易数
router.get('/getDailyTradingVolume', function (req, res, next) {
    goods.getDailyTradingVolume(function (result) {
        res.json(result);
    })
})

//获取过去12个月交易数
router.get('/getMonthlyTradingVolume', function (req, res, next) {
    goods.getMonthlyTradingVolume(function (result) {
        res.json(result);
    })
})

//获取举报信息
router.get('/getReport', function (req, res, next) {
    goods.getReport(function (result) {
        res.json(result);
    })
})

//删除举报商品
router.get('/delReportByGoodsId', function (req, res, next) {
    let goodsId = req.query.goodsId;
    goods.delReportByGoodsId(goodsId, function (err) {
        if (err) {
            const data = {
                status: 404,
                text: '提交失败'
            }
            res.json(data);
        }
        const data = {
            status: 200,
            text: '审核成功'
        }
        res.json(data);
    })
})


module.exports = router;