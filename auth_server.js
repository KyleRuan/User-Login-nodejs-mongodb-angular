/**
 * Created by kyle on 2016/12/2.
 */

/**
 * 创建一个到MongoDB的连接 和启动Express服务器
 * 主程序启动js
 */


var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// var index = require('./routes/index');
// var users = require('./routes/users');

var app = express();
// session
/**
 *有时候，我们需要session的声明周期要长一点，比如好多网站有个免密码两周内自动登录的功能。
 * 基于这个需求，session必须寻找内存之外的存储载体，数据库能提供完美的解决方案。
 * mongodb数据库，作为一个NoSQL数据库，它的基础数据对象时database-collection-document 对象模型非常直观并易于理解，
 * 针对node.js 也提供了丰富的驱动和API。
 * express框架提供了针对mongodb的中间件：connect-mongo，
 * 只需在挂载session的时候在options中传入mongodb的参数即可，程序运行的时候,
 * express app 会自动的替我们管理session的存储，更新和删除。
 * 这样不同的浏览器和ip访问的时候就可以保存cookie了
 */

// 数据库连接的管理
var expressSession = require('express-session');
var mongoStore = require('connect-mongo')({session:expressSession});
require('./models/users_model');
var conn =mongoose.connect('mongodb://localhost/myapp');


// 设置 Web server

// view engine setup
app.engine('.html',require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//中间件设置

// app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



// 将路由管理交由routes文件夹下的index.js 管理



app.use(expressSession({
//    cookie: {maxAge: 80000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
  secret: 'SECRET',
  cookie: {maxAge:60*60*1000},
  // store 就是将session 存储到数据库中去
  resave:false,//添加这行
  saveUninitialized: true,//添加这行
    store: new  mongoStore({
      mongooseConnection: conn.connection,
    // db: mongoose.connection.db, //数据库的名称
    collection: 'sessions'
  })
}));
require('./routes')(app);
// 监听80 端口
app.listen(3030);