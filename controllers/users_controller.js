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
      res.session.error = err;
      res.redirect('/signup');
    } else {
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
      err = 'Authentication failed.';
    }
    if (err) {
      req.session.regenerate(function(){
        req.session.msg = err;
        res.redirect('/login');
      });
    }
  });

};

exports.getUserProfile = function (req,res) {
  // 找到用户
  //_id 为主键
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
  });
};
