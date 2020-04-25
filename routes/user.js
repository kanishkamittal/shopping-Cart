var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Cart=require('../models/cart')

var csrfProtectionToken = csrf();
router.use(csrfProtectionToken);

/* GET and POST : user signup page. */
router.get('/signup', function(req, res, next){
  var messages = req.flash('error');
  res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signup', passport.authenticate('local.signup', {
  failureRedirect: '/user/signup',
  failureFlash: true
}),function(req,res,next){
  if(req.session.oldUrl)
  {
    var oldUrl=req.session.oldUrl
    req.session.oldUrl=null  
    req.redirect(oldUrl)
  }
  else{
    res.redirect('/user/profile')
  }
});

/* GET and POST : user signin page. */
router.get('/signin', function(req, res, next){
  var messages = req.flash('error');
  res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signin', passport.authenticate('local.signin', {
  failureRedirect: '/user/signin',
  failureFlash: true
}),function(req,res,next){
  if(req.session.oldUrl)
  {
    var oldUrl=req.session.oldUrl
    req.session.oldUrl=null  
    res.redirect(oldUrl)
  }
  else{
    res.redirect('/user/profile')
  }
});

/* GET : user profile page. */
router.get('/profile', isLoggedIn, function(req, res, next){
  var cart=new Cart(req.session.cart ? req.session.cart:{})
  res.render('user/profile', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/logout', isLoggedIn, function(req, res, next){
  req.logout();
  res.redirect('/');
});

router.use('/', isNotLoggedIn, function(req,res, next){
  next();
});

module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

function isNotLoggedIn(req, res, next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}