/**
 * Created by kyle on 2016/12/2.
 */

/**
 * 创建一个到MongoDB的连接 和启动Express服务器
 * 主程序启动js
 */

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();


// 数据库连接的管理
var expressSession = require('express-session');
var mongoStore = require('connect-mongo')({session:expressSession});
require('./models/users_model');
var conn =mongoose.connect('mongodb://localhost/myapp');
mongoose.Promise = require('bluebird');


app.engine('.html',require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//中间件设置
/*app.use(bodyParser.urlencoded({ extended: true }));
扩展选项允许在解析URL编码数据与querystring库（当为false时）或qs库（当为true时）之间进行选择。
 “扩展”语法允许将丰富的对象和数组编码为URL编码格式，允许使用URL编码的类似JSON的体验。*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());



// 将路由管理交由routes文件夹下的index.js 管理


/*
 强制将“未初始化”的会话保存到商店。 会话在为新的但未修改时未初始化。
 选择false可用于在设置Cookie之前实施登录会话，减少服务器存储空间使用情况或遵守需要权限的法律。
 选择false还将有助于客户端在没有会话的情况下发出多个并行请求的竞争条件。
 默认值为true，但使用默认值已弃用，因为默认值将在以后更改。 请研究此设置，并选择适合您的使用情况。
 */
app.use(expressSession({
//    cookie: {maxAge: 80000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
  secret: 'SECRET',
  cookie: {maxAge:60*60*1000},
  // store 就是将session 存储到数据库中去
  resave:false,
  saveUninitialized: true,
    store: new  mongoStore({
      mongooseConnection: conn.connection,
    collection: 'sessions'
  })
}));
require('./routes')(app);
app.listen(3030);