var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressJWT = require('express-jwt');
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var postRouter = require('./routes/post');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//设置模板的后缀是html
app.engine('html', require('ejs').renderFile);
//指定总模板
app.set('view engine', 'html');

//配置session
app.use(session({
  secret: 'this is a string key',   // 可以随便写。 一个 String 类型的字符串，作为服务器端生成 session 的签名
  name: 'session_id',/*保存在本地cookie的一个名字 默认connect.sid  可以不设置*/
  resave: false,   /*强制保存 session 即使它并没有变化,。默认为 true。建议设置成 false。*/
  saveUninitialized: true,   //强制将未初始化的 session 存储。  默认值是true  建议设置成true
  cookie: {
    maxAge: 1000 * 30 * 60    /*过期时间*/

  },   /* secure:true  https这样的情况才可以访问cookie */
  rolling: true, //在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）
  store: new MongoStore({
    url: 'mongodb://127.0.0.1:27017/mall',  //数据库的地址  shop是数据库名
    touchAfter: 24 * 3600   // 通过这样做，设置touchAfter:24 * 3600，您在24小时内只更新一次会话，不管有多少请求(除了在会话数据上更改某些内容的除外)
  })
}));

//配置跨域
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//拦截token
var secretOrPrivateKey = "This is perfect projects."; //加密token 校验token时要使用
app.use(expressJWT({
  secret: secretOrPrivateKey
}).unless({
  path: ['/user/login', '/user/key', '/user/mail', '/user/getCode', '/user/register', '/user/findMail', '/user/findCode', '/user/changePassword', '/admin/login', '/', '/admin/register']  //除了这个地址，其他的URL都需要验证
}));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/admin', adminRouter);
app.use('/post', postRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
