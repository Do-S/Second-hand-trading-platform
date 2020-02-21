var db = require('../models/db');

//保存帖子
exports.addPost = function (title, content, userId, callback) {
    const savePost = new db.post({
        userId: userId,
        title: title,
        content: content,
        date: new Date()
    });
    console.log(new Date())
    savePost.save(function (err) {
        if (err) {
            console.error(err);
        }
        db.post.updateOne({ _id: savePost._id }, { $set: { postId: savePost._id } }, function (err) {
            if (err) {
                console.error(err);
            }
            return callback(err);
        });
    })
}

//获取帖子
exports.getPost = function (count, callback) {
    db.post.aggregate([
        { $skip: count },
        { $limit: 20 },
        {
            $lookup:
            {
                from: "user",
                localField: "userId",
                foreignField: "userId",
                as: "user"
            }
        },
        { $sort: { "date": -1 } },
        { $unwind: "$user" },
    ]).exec(function (err, docs) {
        if (err) {
            if (callback) callback(err);
        } else {
            if (callback) callback(docs);
        }
    })
}

//根据帖子id获取帖子详情
exports.getPostByPostId = function (postId, callback) {
    db.post.aggregate([
        { $match: { 'postId': postId } },
        {
            $lookup:
            {
                from: "user",
                localField: "userId",
                foreignField: "userId",
                as: "user"
            }
        },
        { $unwind: "$user" },
    ]).exec(function (err, docs) {
        if (err) {
            if (callback) callback(err);
        } else {
            // if (callback) callback(docs[0]);
            db.post.updateOne({ postId: postId }, { $inc: { count: 1 } }, function (err) {
                return callback(docs[0]);
            })
        }
    })
}

//添加评论
exports.addComment = function (postId, userId, comment, callback) {
    const saveComment = new db.comment({
        userId: userId,
        postId: postId,
        content: comment,
        date: new Date()
    });
    saveComment.save(function (err) {
        if (err) {
            console.error(err);
        }
        return callback(err);
    })
}

//删除评论
exports.delComment = function (commentId, callback) {
    db.comment.remove({ _id: commentId }, function (err) {
        if (err) {
            console.log(err);
        }
        return callback(err);
    })
}

//获取评论
exports.getCommentByPostId = function (postId, callback) {
    db.comment.aggregate([
        { $match: { 'postId': postId } },
        {
            $lookup:
            {
                from: "user",
                localField: "userId",
                foreignField: "userId",
                as: "user"
            }
        },
        { $unwind: "$user" },
    ]).exec(function (err, docs) {
        if (err) {
            if (callback) callback(err);
        } else {
            if (callback) callback(docs);
        }
    })
}

//获取流行贴
exports.getPopularPost = function (callback) {
    let nowTime = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
    let dateTime = new Date(nowTime).getTime(); // 获取现在的时间
    let dateDay = new Date().getDay();
    let oneDayTime = 24 * 60 * 60 * 1000;

    let lastMon = new Date(dateTime - (dateDay + 13) * oneDayTime);
    let lastSun = new Date(dateTime - (dateDay + 6) * oneDayTime);
    db.post.aggregate([
        {
            $match: {
                date: {
                    $gte: lastMon, $lt: lastSun
                }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
            $lookup:
            {
                from: "user",
                localField: "userId",
                foreignField: "userId",
                as: "user"
            }
        },
        { $unwind: "$user" },
    ]).exec(function (err, docs) {
        if (err) {
            if (callback) callback(err);
        } else {
            if (callback) callback(docs);
        }
    })
}

//添加收藏
exports.addCollect = function (userId, postId, callback) {
    const saveCollect = new db.collect({
        userId: userId,
        postId: postId,
        date: new Date()
    });
    saveCollect.save(function (err) {
        if (err) {
            console.error(err);
        }
        return callback(err);
    })
}

//删除收藏
exports.delCollect = function (userId, postId, callback) {
    db.collect.remove({ postId: postId, userId: userId }, function (err) {
        if (err) {
            console.log(err);
        }
        return callback(err);
    })
}

//获取收藏
exports.getCollectByPostId = function (postId, userId, callback) {
    db.collect.find({ postId: postId, userId: userId }).count(function (err, count) {
        if (err) {
            console.error(err);
        }
        return callback(count);
    })
}

//根据userId获取帖子
exports.getPostByUserId = function (userId, callback) {
    db.post.find({ userId: userId }, function (err, docs) {
        if (err) {
            console.error(err);
        }
        return callback(docs);
    }).sort({ date: -1 })
}

//根据userId获取帖子
exports.getCollectByUserId = function (userId, callback) {
    db.collect.aggregate([
        { $match: { 'userId': userId } },
        { $sort: { date: -1 } },
        {
            $lookup:
            {
                from: "post",
                localField: "postId",
                foreignField: "postId",
                as: "post"
            }
        },
        { $unwind: "$post" },
    ]).exec(function (err, docs) {
        if (err) {
            if (callback) callback(err);
        } else {
            if (callback) callback(docs);
        }
    })
}

//删除帖子
exports.delPostByPostId = function (postId, callback) {
    db.post.remove({ postId: postId }, function (err) {
        if (err) {
            console.log(err);
        }
        return callback(err);
    })
}

//根据搜索值获取帖子
exports.getPostBySearch = function (page, postSearch, callback) {
    db.post.aggregate([
        {
            $match: { title: { $regex: new RegExp(postSearch, "i") } }
        },
        { $skip: page },
        { $limit: 20 },
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
        { $unwind: "$user" },
    ]).exec(function (err, docs) {
        if (err) {
            return callback(err);
        } else {
            return callback(docs);
        }
    })
}

//根据帖子id更新帖子
exports.updatePostByPostId = function (title, content, postId, callback) {
    db.post.updateOne({ postId: postId }, {
        $set: {
            content: content,
            title: title,
            date: Date.now()
        }
    }, function (err) {
        if (err) {
            console.error(err);
        }
        return callback(err);
    });
}
