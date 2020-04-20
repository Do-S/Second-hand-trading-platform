var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var post = require('../service/post');
const NodeRSA = require('node-rsa')
var publicKey = fs.readFileSync(path.join(__dirname, '../public/key/pub.key')).toString();
var privateKey = fs.readFileSync(path.join(__dirname, '../public/key/pri.key')).toString();
var priKey = new NodeRSA(privateKey);
var pubKey = new NodeRSA(publicKey);
priKey.setOptions({ encryptionScheme: 'pkcs1' });
pubKey.setOptions({ encryptionScheme: 'pkcs1' })

router.post('/addPost', function (req, res, next) {
    let title = req.body.title;
    let content = req.body.content;
    let userId = req.body.userId
    post.addPost(title, content, userId, function (err) {
        if (err) {
            const data = {
                status: 404,
                text: '发布失败'
            }
            res.json(data);
        }
        const data = {
            status: 200,
            text: '发布成功'
        }
        res.json(data);
    })
})
router.get('/getPost', function (req, res, next) {
    let count = parseInt(req.query.count);
    let pageSize = parseInt(req.query.pageSize);
    post.getPost(count, pageSize, function (result) {
        post.getPostCount(function (count) {
            const data = {
                count: count,
                result: result
            }
            res.json(data);
        })
    })
})
router.get('/getPostDetail', function (req, res, next) {
    let postId = req.query.postId;
    post.getPostByPostId(postId, function (result) {
        res.json(result);
    })
})
router.post('/addComment', function (req, res, next) {
    let postId = req.body.postId;
    let userId = req.body.userId;
    let comment = req.body.comment;

    post.addComment(postId, userId, comment, function (err) {
        if (err) {
            let data = {
                status: 404,
                text: '评论失败'
            }
            res.json(data);
        }
        let data = {
            status: 200,
            text: '评论成功'
        }
        res.json(data);
    })
})
router.get('/delComment', function (req, res, next) {
    let commentId = req.query.commentId;
    post.delComment(commentId, function (err) {
        if (err) {
            let data = {
                status: 404,
                text: '删评失败'
            }
            res.json(data);
        }
        let data = {
            status: 200,
            text: '删评成功'
        }
        res.json(data);
    })
})
router.get('/getCommentByPostId', function (req, res, next) {
    let postId = req.query.postId;
    post.getCommentByPostId(postId, function (result) {
        res.json(result);
    })
})
router.get('/getPopularPost', function (req, res, next) {
    post.getPopularPost(function (result) {
        res.json(result);
    })
})
router.get('/addCollect', function (req, res, next) {
    let userId = req.query.userId;
    let postId = req.query.postId;
    post.addCollect(userId, postId, function (err) {
        if (err) {
            let data = {
                status: 404,
                text: '收藏失败'
            }
            res.json(data);
        }
        let data = {
            status: 200,
            text: '收藏成功'
        }
        res.json(data);
    })
})
router.get('/delCollect', function (req, res, next) {
    let userId = req.query.userId;
    let postId = req.query.postId;
    post.delCollect(userId, postId, function (err) {
        if (err) {
            let data = {
                status: 404,
                text: '取消收藏失败'
            }
            res.json(data);
        }
        let data = {
            status: 200,
            text: '取消收藏成功'
        }
        res.json(data);
    })
})
router.get('/getCollectByPostId', function (req, res, next) {
    let postId = req.query.postId;
    let userId = req.query.userId;
    post.getCollectByPostId(postId, userId, function (result) {
        res.json(result);
    })
})
router.get('/getPostByUserId', function (req, res, next) {
    let userId = req.query.userId;
    post.getPostByUserId(userId, function (result) {
        res.json(result);
    })
})
router.get('/getCollectByUserId', function (req, res, next) {
    let userId = req.query.userId;
    post.getCollectByUserId(userId, function (result) {
        res.json(result);
    })
})
router.get('/delPostByPostId', function (req, res, next) {
    let postId = req.query.postId;
    post.delPostByPostId(postId, function (err) {
        if (err) {
            let data = {
                status: 404,
                text: '删除失败'
            }
            res.json(data);
        }
        let data = {
            status: 200,
            text: '删除成功'
        }
        res.json(data);
    })
})
router.get('/getPostBySearch', function (req, res, next) {
    let page = req.query.page;
    let postSearch = req.query.postSearch;
    let pageSize = req.query.pageSize;
    post.getPostBySearch(+page, postSearch, +pageSize, function (result) {
        post.getPostBySearchCount(postSearch, function (count) {
            const data = {
                count: count,
                result: result
            }
            res.json(data);
        })
    })
})
router.post('/updatePostByPostId', function (req, res, next) {
    let title = req.body.title;
    let content = req.body.content;
    let postId = req.body.postId
    post.updatePostByPostId(title, content, postId, function (err) {
        if (err) {
            const data = {
                status: 404,
                text: '发布失败'
            }
            res.json(data);
        }
        const data = {
            status: 200,
            text: '发布成功'
        }
        res.json(data);
    })
})


module.exports = router;