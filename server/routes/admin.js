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
    let password = priKey.decrypt(req.body.password, 'utf8');
    user.getAdmin(userName, function (result) {
        if (result) {
            if (password == priKey.decrypt(result.password, 'utf8')) {
                let content = { userName: userName };  // 要生成token的主题信息
                let secretKey = "This is perfect projects.";
                let token = jwt.sign(content, secretKey, {
                    expiresIn: 60 * 60 * 5  // 授权时效5小时
                });
                const data = {
                    "token": 'Bearer' + ' ' + token,
                    "status": 200,
                    "userName": userName,
                    "userId": result._id,
                    "adminStatus": result.status
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
    let adminCode = req.body.adminCode;
    user.getAdmin(userName, function (outcome) {
        if (outcome) {
            const data = {
                status: 300,
                text: '该用户已经注册'
            }
            res.json(data);
        } else {
            user.getAdminCodeByCode(adminCode, function (result) {
                if (result) {
                    if (result.status == 0) {
                        user.addAdmin(userName, password, adminCode, function (err) {
                            if (err) {
                                const data = {
                                    status: 201,
                                    text: '注册失败'
                                }
                                res.json(data);
                            } else {
                                const data = {
                                    status: 200,
                                    text: '注册成功'
                                }
                                res.json(data);
                            }
                        })
                    } else {
                        const data = {
                            status: 500,
                            text: '授权码已被使用'
                        }
                        res.json(data);
                    }
                } else {
                    const data = {
                        status: 404,
                        text: '授权码错误'
                    }
                    res.json(data);
                }
            })
        }
    })
})

//主页
router.get('/getIndex', function (req, res, next) {
    res.json({});
})

//修改管理员密码
router.post('/updatePassword', function (req, res, next) {
    let userId = req.body.userId;
    let password = priKey.decrypt(req.body.password, 'utf8');
    let newPassword = req.body.newPassword;
    user.getAdminById(userId, function (result) {
        if (result) {
            if (priKey.decrypt(result.password, 'utf8') == password) {
                user.updatePassword(userId, newPassword, function (err) {
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

//申请注册授权码
router.get('/applyAdminCode', function (req, res, next) {
    let userId = req.query.userId;
    let password = priKey.decrypt(req.query.password, 'utf8');
    user.getAdminById(userId, function (result) {
        if (result) {
            if (password == priKey.decrypt(result.password, 'utf8')) {
                function judgeCode() {

                    let adminCode = ""
                    for (var i = 0; i < 25; i++) {
                        var ranNum = Math.ceil(Math.random() * 25);
                        if (Math.ceil(Math.random() * 5) == 1) {
                            adminCode += Math.ceil(Math.random() * 7) + 2;
                        } else {
                            adminCode += String.fromCharCode(65 + ranNum);
                        }
                    }

                    user.getAdminCodeByCode(adminCode, function (outcome) {
                        if (outcome) {
                            judgeCode();
                        } else {
                            user.saveAdminCode(userId, adminCode, function (err) {
                                if (err) {
                                    const data = {
                                        status: 500,
                                        text: '申请失败，请重新尝试',
                                    }
                                    res.json(data);
                                } else {
                                    const data = {
                                        status: 200,
                                        text: '申请成功',
                                        code: adminCode
                                    }
                                    res.json(data);
                                }
                            })
                        }
                    })
                }
                judgeCode()
            } else {
                const data = {
                    status: 201,
                    text: '密码错误',
                }
                res.json(data);
            }
        } else {
            const data = {
                status: 404,
                text: '你没有权限申请授权码'
            }
            res.json(data);
        }
    })
})

//根据id获取授权码
router.get('/getAdminCode', function (req, res, next) {
    let userId = req.query.userId;
    user.getAdminCodeByUserId(userId, function (result) {
        res.json(result);
    })
})

//根据codeId删除授权码
router.get('/delAdminCode', function (req, res, next) {
    let codeId = req.query.codeId;
    user.delAdminCode(codeId, function (err) {
        if (err) {
            const data = {
                status: 404,
                text: '删除失败'
            }
            res.json(data);
        }
        const data = {
            status: 200,
            text: '删除成功'
        }
        res.json(data);
    })
})

//修改管理员状态
router.get('/changeAdminStatus', function (req, res, next) {
    let userId = req.query.userId;
    let adminId = req.query.adminId;
    let password = priKey.decrypt(req.query.password, 'utf8');
    let status = req.query.status;
    user.getAdminById(adminId, function (result) {
        if (priKey.decrypt(result.password, 'utf8') == password) {
            user.updateAdminStatus(userId, status, function (err) {
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
    })
})

//根据codeId删除已使用授权码
router.get('/delAdminUsedCode', function (req, res, next) {
    let codeId = req.query.codeId;
    let userId = req.query.userId;
    let adminId = req.query.adminId;
    let password = priKey.decrypt(req.query.password, 'utf8');
    user.getAdminById(adminId, function (result) {
        if (priKey.decrypt(result.password, 'utf8') == password) {
            user.delAdminCode(codeId, function (err) {
                if (err) {
                    const data = {
                        status: 404,
                        text: '删除失败'
                    }
                    res.json(data);
                } else {
                    user.delAdminByUserId(userId, function (err) {
                        const data = {
                            status: 200,
                            text: '删除成功'
                        }
                        res.json(data);
                    })
                }
            })
        } else {
            const data = {
                status: 404,
                text: '密码错误'
            }
            res.json(data);
        }
    })
})


module.exports = router;