/**
 * Created by kyle on 2016/12/2.
 */

/**
 *
 * 定义需要与mongoDB 模型交货的路由功能,增删查找
 */

var mongoose = require('mongoose');
var User = mongoose.model('User');
var crypto = require('crypto');


/*将密码hash化*/
function hashPW(pwd) {
  if (pwd) {
    return crypto.createHash('sha512').update(pwd).digest('base64').toString();
  }

}

/*注册逻辑控制器*/
exports.signup = function (req,res) {
  // 根据mongo 的model生成一个 对象
  var user = new User({username:req.body.username});
  user.set('email',req.body.email);
  user.set('hashed_password',hashPW(req.body.password));
  // 保存
  user.save(function (err) {
    if (err) {
      // 存在err
      res.session.error = err;
      res.redirect('/signup');
    } else {
      // 设置session
      req.session.username = user.username;
      req.session.password = user.hashed_password;
      req.session.msg = 'Authenticated as ' + user.username;
      res.redirect('/');
    }
  });
};


exports.login = function (req,res) {

  User.findOne({username:req.body.username}).exec(function (err,user) {
    if (!user) {
      err = 'User Not Find';
    } else if (user.hashed_password === hashPW(req.body.password)) {
      // 如果密码正确
      //session提供了regenerate方法，用来将整个session清空，然后可以重新赋值。
        req.session.regenerate(function () {
        req.session.user = user.id;
        req.session.username = user.username;
        req.session.msg = 'Authenticated as ' + user.username;
        res.redirect('/');
      });
    } else {
      // 密码错误
      err = 'Authentication failed.';
    }

    if (err) {
      // err , 会有那些错呢
      req.session.regenerate(function(){
        req.session.msg = err;
        res.redirect('/login');
      });
    }
  });

};


exports.getUserProfile = function (req,res) {
  // 找到用户
  //_id 相当于一个主键
  //众所周知，Node.js在child_process模块中提供了spawn和exec这两个方法，用来开启子进程执行指定程序。
  /*从文档里可以得出的一些相同点：
   1，它们都用于开一个子进程执行指定命令。
   2，它们都可以自定义子进程的运行环境。
   3，它们都返回一个ChildProcess对象，所以他们都可以取得子进程的标准输入流，标准输出流和标准错误流 。
   */
  /*不同点：
   1，接受参数的方式： spawn使用了参数数组，而exec则直接接在命令后。

   2，子进程返回给Node的数据量： spawn没有限制子进程可以返回给Node的数据大小，
   而exec则在options配置对象中有maxBuffer参数限制，且默认为200K，如果超出，那么子进程将会被杀死，
   并报错：Error：maxBuffer exceeded，虽然可以手动调大maxBuffer参数，但是并不被推荐。
   由此可窥见一番Node.js设置这两个API时的部分本意，spawn应用来运行返回大量数据的子进程，如图像处理，文件读取等。
   而exec则应用来运行只返回少量返回值的子进程，如只返回一个状态码。
   3，调用对象： 虽然在官方文档中，两个方法接受的第一个参数标注的都是command，即要执行的命令，但其实不然。
   spawn接受的第一个参数为文件，而exec接受的第一个参数才是命令。

   */
  // child_process.exec(command[, options], callback)
  User.findOne({_id:req.session.user}).exec(function (err,user) {
    if (user) {
      // user 找到了
      res.json(user);
    } else {
      // 没有找到
      res.json(404,{err: 'User Not Found.'})
    }
  });
};


exports.updateUser = function(req, res){
  User.findOne({_id:req.session.user}).exec(function (err,user) {
    if (user) {
      user.set('email',req.body.email);
      user.set('color',req.body.color);
      user.save(function (err) {
        if (err) {
          res.session.error = err;
        } else {
          req.session.msg = 'User Updated.';
        }
        res.redirect('/');
      });
    }
  });
};

exports.deleteUser = function(req, res){
  User.findOne({ _id: req.session.user })
      .exec(function (err,user) {
    if (user) {
      user.remove(function (err) {
        if (err){
          req.session.msg = err;
        }
          req.session.destroy(function(){
          res.redirect('/login');
        });
      });
      res.redirect('/');
    } else{
      req.session.msg = "User Not Found!";
      req.session.destroy(function(){
        res.redirect('/login');
      });
    }
  })
};
