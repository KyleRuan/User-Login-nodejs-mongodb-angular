var express = require('express');
// 加密
var crypto =require('crypto');



module.exports = function (app) {
  /**
   * express.static 是 Express 内置的唯一一个中间件,负责托管 Express 应用内的静态资源
   * 第一个参数指的是静态资源文件所在的根目录。options 对象是可选的，支持以下属性：
   *
   */
  var users= require('../controllers/users_controller');
  /**
   * use在路径中装载中间件功能。 如果未指定path，则默认为“/”
   * 下面代码的意思就是当路由到/static的时候,加载../static下的文件
   * 当路由到/static的时候,加载../lib下的文件
   */
  app.use('/static',express.static('../static')).
      use('/lib', express.static( '../lib'));
  app.get('/',function (req,res) {
    if (req.session.user) {
      res.render('index',{username:req.session.username,
                           msg:req.session.msg});
    } else  {
      req.session.msg = 'Access denied';
      res.redirect('/login');
    }
  });

  // user
  
  app.get('/user',function (req,res) {
    if (req.session.user) {
      res.render('user', {msg: req.session.msg});
    } else {
      res.session.msg = 'Access denied';
      res.redirect('/login');
    }
  });

  //singup
  app.get('/singup',function (req,res) {
      if (req.session.user) {
        res.redirect('/');
      }
      res.render('signup',{msg:req.session.msg});
  });

  //login
  app.get('/login',function (req,res) {
    if (req.session.user) {
      res.redirect('/');
    }
    res.render('login',{msg:req.session.msg});
  });

  //post
  app.get('/post',function (req,res) {
    if (req.session.user) {
      res.redirect('/');
    }
    res.render('post',{msg:req.session.msg});
  });

  app.post('/signup', users.signup);
  app.post('/user/update', users.updateUser);
  app.post('/user/delete', users.deleteUser);
  app.post('/login', users.login);
  app.get('/user/profile', users.getUserProfile);

};


