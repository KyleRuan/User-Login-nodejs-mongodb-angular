var crypto = require('crypto');
var express = require('express');
module.exports = function(app) {
  var users = require('./../controllers/users_controller');
  //获取静态文件,这样就有可以通过 localhost:3030/static/app/js/my_app.js来获取静态资源了
  app.use('/static', express.static( __dirname+'/app'));
  app.get('/', function(req, res){
    if (req.session.user) {
      res.render('index', {username: req.session.username,
        msg:req.session.msg});
    } else {
      req.session.msg = 'Access denied!';
      res.redirect('/login');
    }
  });
  app.get('/user', function(req, res){
    if (req.session.user) {
      res.render('user', {msg:req.session.msg});
    } else {
      req.session.msg = 'Access denied!';
      res.redirect('/login');
    }
  });
  app.get('/signup', function(req, res){
    if(req.session.user){
      res.redirect('/');
    }
    res.render('signup', {msg:req.session.msg});
  });
  app.get('/login',  function(req, res){
    if(req.session.user){
      res.redirect('/');
    }
    res.render('login', {msg:req.session.msg});
  });
  app.get('/logout', function(req, res){
    req.session.destroy(function(){
      res.redirect('/login');
    });
  });
  // 从client接收到的网址
  app.post('/signup', users.signup);
  app.post('/user/update', users.updateUser);
  app.post('/user/delete', users.deleteUser);
  app.post('/login', users.login);
  app.get('/user/profile', users.getUserProfile);
}
