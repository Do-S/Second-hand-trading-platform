const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/mall')

//用户
const userSchema = new mongoose.Schema({
    userId: String,
    mail: String,
    password: String,
    nickname: {
        type: String,
        default: ''
    },
    birthday: {
        type: Date,
        default: ''
    },
    sex: {
        type: String,
        default: '保密'
    },
    avatar: {
        type: String,
        default: 'http://localhost:3000/images/avatar/default.jpg'
    },
    status: {
        type: Number,
        default: 1
    },
    date: {
        type: Date
    },
    introduction: {
        type: String,
        default: ''
    },
}, { collection: 'user' })

//举报信息
const reportSchema = new mongoose.Schema({
    reporter: String,
    reported: String,
    goodsId: String,
    content: String,
    status: {
        type: Number,
        default: 0
    },
    date: {
        type: Date
    },
}, { collection: 'report' })

//管理员
const adminSchema = new mongoose.Schema({
    userId: String,
    user: String,
    password: String,
    date: Date,
    status: {
        type: Number,
        default: 0
    }
}, { collection: 'admin' })

//管理员授权码
const adminCodeSchema = new mongoose.Schema({
    userId: String,
    adminCode: String,
    date: Date,
    adminId: String,
    status: {
        type: Number,
        default: 0
    }
}, { collection: 'adminCode' })

//商品
const goodsSchema = new mongoose.Schema({
    goodsId: {
        type: String,
        default: ''
    },
    userId: String,
    goodsName: String,
    price: Number,
    introduction: String,
    mail: Boolean,
    old: Number,
    date: {
        type: Date
    },
    status: {
        type: Number,
        default: 1
    },
    count: {
        type: Number,
        default: 0
    },
}, { collection: 'goods' })

//商品图片
const imgSchema = new mongoose.Schema({
    goodsId: String,
    url: String,
}, { collection: 'img' })

//购物车
const carSchema = new mongoose.Schema({
    goodsId: String,
    userId: String,
    date: {
        type: Date
    },
}, { collection: 'car' })

//交易信息
const buySchema = new mongoose.Schema({
    goodsId: String,
    userId: String,
    sellerId: String,
    status: {
        type: Number,
        default: 1
    },
    date: {
        type: Date
    },
}, { collection: 'buy' })

//帖子
const postSchema = new mongoose.Schema({
    postId: {
        type: String,
        default: ''
    },
    userId: String,
    title: String,
    content: String,
    date: {
        type: Date
    },
    count: {
        type: Number,
        default: 0
    },
}, { collection: 'post' })

//帖子评论
const commentSchema = new mongoose.Schema({
    userId: String,
    postId: String,
    content: String,
    date: {
        type: Date
    },
}, { collection: 'comment' })

//帖子收藏
const collectSchema = new mongoose.Schema({
    postId: String,
    userId: String,
    date: {
        type: Date
    },
}, { collection: 'collect' })

//邮箱验证码储存
const mailLogSchema = new mongoose.Schema({
    createdAt: Date,
    mail: String,
    v_code: Number,
}, { collection: 'mailLog' })

const Models = {
    user: mongoose.model('user', userSchema),
    report: mongoose.model('report', reportSchema),
    admin: mongoose.model('admin', adminSchema),
    adminCode: mongoose.model('adminCode', adminCodeSchema),
    goods: mongoose.model('goods', goodsSchema),
    img: mongoose.model('img', imgSchema),
    car: mongoose.model('car', carSchema),
    buy: mongoose.model('buy', buySchema),
    post: mongoose.model('post', postSchema),
    comment: mongoose.model('comment', commentSchema),
    collect: mongoose.model('collect', collectSchema),
    mailLog: mongoose.model('mailLog', mailLogSchema),
    mailLogSchema: mailLogSchema,
    mongoose: mongoose,
}

module.exports = Models