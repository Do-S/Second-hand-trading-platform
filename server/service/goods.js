var db = require('../models/db');

//添加商品
exports.setGoods = function (commodityData, userId, callback) {
    const saveGoods = new db.goods({
        userId: userId,
        goodsName: commodityData.name,
        price: commodityData.price,
        introduction: commodityData.content,
        mail: commodityData.mail,
        old: commodityData.old,
        date: new Date()
    });
    saveGoods.save(function (err) {
        if (err) {
            console.error(err);
        }
        db.goods.updateOne({ _id: saveGoods._id }, { $set: { goodsId: saveGoods._id } }, function (err) {
            if (err) {
                console.error(err);
            }
            return callback(saveGoods._id, err);
        });
    })
};

//添加商品图片
exports.setGoodsImg = function (imgId, filePath, callback) {
    const saveGoodsImg = new db.img({
        goodsId: imgId,
        url: filePath,
    });
    saveGoodsImg.save(function (err) {
        if (err) {
            console.error(err);
        }
        return callback(err);
    })
};

//获取商品
exports.getGoods = function (page, pageSize, callback) {
    db.goods.aggregate([
        {
            $match: { status: 1 }
        },
        { $sort: { date: -1 } },
        { $skip: page },
        { $limit: pageSize },
        {
            $lookup:
            {
                from: "user",
                localField: "userId",
                foreignField: "userId",
                as: "user"
            }
        },
        {
            $lookup:
            {
                from: "img",
                localField: "goodsId",
                foreignField: "goodsId",
                as: "img"
            }
        },
        { $unwind: "$user" },
    ]).exec(function (err, docs) {
        if (err) {
            return callback(err);
        } else {
            return callback(docs);
        }
    })
}

//根据商品id查找商品信息
exports.getGoodsById = function (id, callback) {
    db.goods.findOne({ _id: id }, function (err, docs) {
        if (err) {
            console.error(err);
        }
        return callback(docs);
    })
}

//获取未下架商品数量
exports.getGoodsCount = function (callback) {
    db.goods.find({ status: 1 }).count(function (err, count) {
        if (err) {
            console.error(err);
        }
        return callback(count);
    })
}

//根据商品id查找一张图片
exports.getGoodsImg = function (id, callback) {
    db.img.findOne({ goodsId: id }, function (err, docs) {
        if (err) {
            console.error(err);
        }
        return callback(docs);
    })
}

//根据商品id查找所有图片
exports.getGoodsImgs = function (id, callback) {
    db.img.find({ goodsId: id }, function (err, docs) {
        if (err) {
            console.error(err);
        }
        return callback(docs);
    })
}

//自增长商品浏览数量
exports.addCount = function (id, callback) {
    db.goods.updateOne({ _id: id }, { $inc: { count: 1 } }, function (err) {
        if (err) {
            console.error(err);
        }
        return callback(err);
    })
}

//添加购物车
exports.addGoodsCar = function (goodsId, userId, callback) {
    const saveGoodsCar = new db.car({
        goodsId: goodsId,
        userId: userId,
        date: new Date()
    });
    saveGoodsCar.save(function (err) {
        if (err) {
            console.error(err);
        }
        return callback(err);
    })
}

//查询购物车是否存在该用户id和商品id的数据
exports.getGoodsCarById = function (userId, goodsId, callback) {
    db.car.findOne({ userId: userId, goodsId: goodsId }, function (err, docs) {
        if (err) {
            console.error(err);
        }
        return callback(docs);
    })
}

//根据商品id查询交易
exports.getGoodsBuyById = function (goodsId, callback) {
    db.buy.findOne({ goodsId: goodsId }, function (err, docs) {
        if (err) {
            console.error(err);
        }
        console.log(docs);
        console.log(goodsId);
        return callback(docs);
    })
}

//添加交易
exports.addGoodsBuy = function (goodsId, userId, callback) {
    db.goods.findOne({ goodsId: goodsId }, function (err, docs) {
        let sellerId = docs.userId;
        const saveGoodsBuy = new db.buy({
            goodsId: goodsId,
            userId: userId,
            sellerId: sellerId,
            date: new Date()
        });
        saveGoodsBuy.save(function (err) {
            if (err) {
                console.error(err);
            }
            db.goods.updateOne({ _id: goodsId }, { $set: { status: 0 } }, function (err) {
                if (err) {
                    console.error(err);
                }
                return callback(err);
            });
        })
    })
}

//根据用户id查找购物车信息
exports.getGoodsCar = function (userId, callback) {
    db.car.aggregate([
        { $match: { 'userId': userId } },
        { $sort: { date: -1 } },
        {
            $lookup:
            {
                from: "goods",
                localField: "goodsId",
                foreignField: "goodsId",
                as: "goods"
            }
        },
        {
            $lookup:
            {
                from: "img",
                localField: "goodsId",
                foreignField: "goodsId",
                as: "img"
            }
        },
        { $unwind: "$goods" },
        // { $unwind: "$img" }
    ]).exec(function (err, docs) {
        if (err) {
            if (callback) callback(err);
        } else {
            if (callback) callback(docs);
        }
    })
}

//根据用户id和商品id删除购物车商品
exports.delCarById = function (userId, goodsId, callback) {
    db.car.remove({ userId: userId, goodsId: goodsId }, function (err) {
        if (err) {
            console.log(err);
        }
        callback(err);
    })
}

//根据用户id和商品id数组删除购物车商品
exports.delCarByIdList = function (userId, carIdList, callback) {
    for (let i = 0; i < carIdList.length; i++) {
        db.car.remove({ userId: userId, goodsId: carIdList[i] }, function (err) {
            if (err) {
                console.log(err);
            } else {
                if (i == carIdList.length - 1) {
                    callback(err);
                }
            }
        })
    }
}

//根据用户id查询商品
exports.getMyRelease = function (userId, callback) {
    db.goods.aggregate([
        {
            $lookup:
            {
                from: "buy",
                localField: "goodsId",
                foreignField: "goodsId",
                as: "inventory_docs"
            }
        },
        {
            $lookup:
            {
                from: "img",
                localField: "goodsId",
                foreignField: "goodsId",
                as: "img"
            }
        },
        { $match: { 'inventory_docs': [], 'userId': userId } },
        { $sort: { date: -1 } },
        // { $unwind: "$inventory_docs" },
        // { $unwind: "$img" }
    ]).exec(function (err, docs) {
        if (err) {
            if (callback) callback(err);
        } else {
            if (callback) callback(docs);
        }
    })
}

//根据商品id修改状态值
exports.updateStatus = function (goodsId, status, callback) {
    db.goods.updateOne({ goodsId: goodsId }, { $set: { status: status } }, function (err) {
        if (err) {
            console.error(err);
        }
        return callback(err);
    });
}

//根据商品id修改商品信息
exports.updateGoods = function (commodityData, goodsId, callback) {
    db.goods.updateOne({ goodsId: goodsId }, {
        $set: {
            goodsName: commodityData.name,
            price: commodityData.price,
            introduction: commodityData.content,
            mail: commodityData.mail,
            old: commodityData.old,
            date: Date.now()
        }
    }, function (err) {
        if (err) {
            console.error(err);
        }
        return callback(err);
    });
}

//根据商品id删除图片
exports.delGoodsImg = function (goodsId, callback) {
    db.img.remove({ goodsId: goodsId }, function (err) {
        if (err) {
            console.log(err);
        }
        return callback(err);
    })
}

//根据商品id删除商品
exports.delGoodsById = function (goodsId, callback) {
    db.car.remove({ goodsId: goodsId }, function (err) {
        if (err) {
            console.log(err);
            return callback(err);
        } else {
            db.goods.remove({ goodsId: goodsId }, function (err) {
                if (err) {
                    console.log(err);
                    return callback(err);
                } else {
                    db.img.remove({ goodsId: goodsId }, function (err) {
                        if (err) {
                            console.log(err);
                        }
                        return callback(err);
                    })
                }
            })
        }
    })
}

//根据用户id查找售卖成功的商品
exports.getGoodsBuyBySellerId = function (userId, callback) {
    db.buy.aggregate([
        { $match: { sellerId: userId } },
        { $sort: { date: -1 } },
        {
            $lookup:
            {
                from: "goods",
                localField: "goodsId",
                foreignField: "goodsId",
                as: "goods"
            }
        },
        {
            $lookup:
            {
                from: "user",
                localField: "userId",
                foreignField: "userId",
                as: "user"
            }
        },
        {
            $lookup:
            {
                from: "img",
                localField: "goodsId",
                foreignField: "goodsId",
                as: "img"
            }
        },
        { $unwind: "$goods" },
        { $unwind: "$user" }
    ]).exec(function (err, docs) {
        if (err) {
            if (callback) callback(err);
        } else {
            if (callback) callback(docs);
        }
    })
}

//根据用户id查找购买成功的商品
exports.getGoodsBuyByUserId = function (userId, callback) {
    db.buy.aggregate([
        {
            $lookup:
            {
                from: "goods",
                localField: "goodsId",
                foreignField: "goodsId",
                as: "goods"
            }
        },
        {
            $lookup:
            {
                from: "user",
                localField: "sellerId",
                foreignField: "userId",
                as: "user"
            }
        },
        {
            $lookup:
            {
                from: "img",
                localField: "goodsId",
                foreignField: "goodsId",
                as: "img"
            }
        },
        { $match: { userId: userId } },
        { $unwind: "$goods" },
        { $unwind: "$user" }
    ]).exec(function (err, docs) {
        if (err) {
            if (callback) callback(err);
        } else {
            if (callback) callback(docs);
        }
    })
}

//批量修改交易记录状态值
exports.markAllBuy = function (userId, callback) {
    db.buy.update(
        { sellerId: userId },
        { $set: { status: 0 } },
        { 'multi': true },
        function (err) {
            if (err) {
                console.error(err);
            }
            return callback(err);
        });
}

//修改交易记录状态值
exports.markBuyById = function (id, callback) {
    db.buy.updateOne({ _id: id }, { $set: { status: 0 } }, function (err) {
        if (err) {
            console.error(err);
        }
        return callback(err);
    });
}

//获取交易
exports.getMarkBuyCount = function (userId, callback) {
    db.buy.find({ sellerId: userId, status: 1 }).count(function (err, count) {
        if (err) {
            console.error(err);
        }
        return callback(count);
    })
}

//根据时间查询交易信息
exports.getGoodsByDate = function (fromDate, toDate, callback) {
    db.buy.aggregate([
        {
            $lookup:
            {
                from: "goods",
                localField: "goodsId",
                foreignField: "goodsId",
                as: "goods"
            }
        },
        {
            $lookup:
            {
                from: "user",
                localField: "userId",
                foreignField: "userId",
                as: "user"
            }
        },
        {
            $lookup:
            {
                from: "user",
                localField: "sellerId",
                foreignField: "userId",
                as: "seller"
            }
        },
        {
            $lookup:
            {
                from: "img",
                localField: "goodsId",
                foreignField: "goodsId",
                as: "img"
            }
        },
        {
            $match: {
                date: { $gte: new Date(fromDate), $lte: new Date(toDate) }
            }
        },
        { $unwind: "$goods" },
        { $unwind: "$user" },
        { $unwind: "$seller" }
    ]).exec(function (err, docs) {
        if (err) {
            console.log(err);
            return callback(err);
        } else {
            return callback(docs);
        }
    })
}

//根据卖家查询交易信息
exports.getGoodsBySeller = function (sellerMail, callback) {
    db.user.findOne({ mail: sellerMail }, function (err, result) {
        let userId = result.userId;
        db.buy.aggregate([
            {
                $lookup:
                {
                    from: "goods",
                    localField: "goodsId",
                    foreignField: "goodsId",
                    as: "goods"
                }
            },
            {
                $lookup:
                {
                    from: "user",
                    localField: "userId",
                    foreignField: "userId",
                    as: "user"
                }
            },
            {
                $lookup:
                {
                    from: "user",
                    localField: "sellerId",
                    foreignField: "userId",
                    as: "seller"
                }
            },
            {
                $lookup:
                {
                    from: "img",
                    localField: "goodsId",
                    foreignField: "goodsId",
                    as: "img"
                }
            },
            { $match: { sellerId: userId } },
            { $unwind: "$goods" },
            { $unwind: "$user" },
            { $unwind: "$seller" }
        ]).exec(function (err, docs) {
            if (err) {
                return callback(err);
            } else {
                return callback(docs);
            }
        })
    })
}

//查询过去七天的交易额
exports.getDailyTurnover = function (callback) {
    let time = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
    let date = new Date(new Date(time).getTime() - (7 * 24 * 60 * 60 * 1000))
    db.buy.aggregate([
        {
            $lookup:
            {
                from: "goods",
                localField: "goodsId",
                foreignField: "goodsId",
                as: "goods"
            }
        },
        {
            $match: {
                date: {
                    $gte: date, $lt: new Date()
                }
            }
        },
        { $unwind: "$goods" },
        {
            $group: {
                _id: {
                    day: { $dayOfMonth: "$date" },
                    month: { $month: "$date" },
                    year: { $year: "$date" }
                },
                count: { $sum: "$goods.price" }
            }
        },
    ]).exec(function (err, docs) {
        if (err) {
            return callback(err);
        } else {
            return callback(docs);
        }
    })
}

//查询过去12个月的交易额
exports.getMonthlyTransaction = function (callback) {
    let nowDate = new Date();
    nowDate.setMonth(nowDate.getMonth() - 12);
    var month = nowDate.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    //在这里可以自定义输出的日期格式
    let date = nowDate.getFullYear() + "-" + month + "-" + 01;
    db.buy.aggregate([
        {
            $lookup:
            {
                from: "goods",
                localField: "goodsId",
                foreignField: "goodsId",
                as: "goods"
            }
        },
        {
            $match: {
                date: {
                    $gte: new Date(date), $lte: new Date(new Date().getFullYear() + '-' + (+new Date().getMonth() + 1))
                }
            }
        },
        { $unwind: "$goods" },
        {
            $group: {
                _id: {
                    month: { $month: "$date" },
                    year: { $year: "$date" }
                },
                count: { $sum: "$goods.price" }
            }
        },
    ]).exec(function (err, docs) {
        if (err) {
            return callback(err);
        } else {
            return callback(docs);
        }
    })
}

//查询过去七天的交易订单数
exports.getDailyTradingVolume = function (callback) {
    let time = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
    let date = new Date(new Date(time).getTime() - (7 * 24 * 60 * 60 * 1000))
    db.buy.aggregate([
        {
            $lookup:
            {
                from: "goods",
                localField: "goodsId",
                foreignField: "goodsId",
                as: "goods"
            }
        },
        {
            $match: {
                date: {
                    $gte: date, $lt: new Date()
                }
            }
        },
        { $unwind: "$goods" },
        {
            $group: {
                _id: {
                    day: { $dayOfMonth: "$date" },
                    month: { $month: "$date" },
                    year: { $year: "$date" }
                },
                count: { $sum: 1 }
            }
        },
    ]).exec(function (err, docs) {
        if (err) {
            return callback(err);
        } else {
            return callback(docs);
        }
    })
}

//查询过去12个月的交易订单数
exports.getMonthlyTradingVolume = function (callback) {
    let nowDate = new Date();
    nowDate.setMonth(nowDate.getMonth() - 12);
    var month = nowDate.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    //在这里可以自定义输出的日期格式
    let date = nowDate.getFullYear() + "-" + month + "-" + 01;
    db.buy.aggregate([
        {
            $lookup:
            {
                from: "goods",
                localField: "goodsId",
                foreignField: "goodsId",
                as: "goods"
            }
        },
        {
            $match: {
                date: {
                    $gte: new Date(date), $lte: new Date(new Date().getFullYear() + '-' + (+new Date().getMonth() + 1))
                }
            }
        },
        { $unwind: "$goods" },
        {
            $group: {
                _id: {
                    month: { $month: "$date" },
                    year: { $year: "$date" }
                },
                count: { $sum: 1 }
            }
        },
    ]).exec(function (err, docs) {
        if (err) {
            return callback(err);
        } else {
            console.log(docs);
            return callback(docs);
        }
    })
}

//添加举报信息
exports.addReport = function (reporter, reported, goodsId, content, callback) {
    const saveReport = new db.report({
        reporter: reporter,
        reported: reported,
        goodsId: goodsId,
        content: content,
        date: new Date()
    });
    saveReport.save(function (err) {
        if (err) {
            console.error(err);
        }
        return callback(err);
    })
}

//获取举报消息
exports.getReport = function (callback) {
    db.report.aggregate([
        {
            $match: { status: 0 }
        },
        {
            $group: {
                _id: '$goodsId',
                count: { $sum: 1 }
            }
        },
        {
            $lookup:
            {
                from: "report",
                localField: "_id",
                foreignField: "goodsId",
                as: "report"
            }
        },
        {
            $lookup:
            {
                from: "goods",
                localField: "_id",
                foreignField: "goodsId",
                as: "goods"
            }
        },
        {
            $lookup:
            {
                from: "img",
                localField: "_id",
                foreignField: "goodsId",
                as: "img"
            }
        },
        { $unwind: "$goods" },
        {
            $lookup:
            {
                from: "user",
                localField: "goods.userId",
                foreignField: "userId",
                as: "reported"
            }
        },
        { $unwind: "$reported" },
    ]).exec(function (err, docs) {
        if (err) {
            return callback(err);
        } else {
            return callback(docs);
        }
    })
}

//根据搜索值获取商品
exports.getGoodsBySearch = function (page, goodsSearch, pageSize, callback) {
    db.goods.aggregate([
        {
            $match: { goodsName: { $regex: new RegExp(goodsSearch, "i") }, status: 1 }
        },
        { $skip: page },
        { $limit: pageSize },
        { $sort: { count: -1 } },
        {
            $lookup:
            {
                from: "user",
                localField: "userId",
                foreignField: "userId",
                as: "user"
            }
        },
        {
            $lookup:
            {
                from: "img",
                localField: "goodsId",
                foreignField: "goodsId",
                as: "img"
            }
        },
        { $unwind: "$user" },
    ]).exec(function (err, docs) {
        if (err) {
            return callback(err);
        } else {
            return callback(docs);
        }
    })
}

//根据搜索值获取商品总数量
exports.getGoodsBySearchCount = function (goodsSearch, callback) {
    db.goods.aggregate([
        {
            $match: { goodsName: { $regex: new RegExp(goodsSearch, "i") }, status: 1 }
        },
        {
            $group: {
                _id: null,
                count: { $sum: 1 }
            }
        },
    ]).exec(function (err, docs) {
        if (err) {
            return callback(err);
        } else {
            return callback(docs);
        }
    })
}

//根据商品id删除举报信息
exports.delReportByGoodsId = function (goodsId, callback) {
    db.report.remove({ goodsId: goodsId }, function (err) {
        if (err) {
            console.log(err);
        }
        return callback(err);
    })
}