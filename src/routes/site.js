const { Router } = require('express');
const express = require('express');
const router = express.Router();
const siteController = require('../controller/siteController.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const User = require('../modules/user');
const bcrypt = require('bcrypt');
const { redgister } = require('../controller/siteController.js');
const CategoryController = require('../controller/categoryController');
const middlewarePrivate = require('../middleware/middlewarePrivate');

// passport local strategy
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ email: username })
      .then(user =>{
        if(user){
          bcrypt.compare(password, user.password, function (err, result) {
            if (result === true) {
              return done(null,user)
            } else {
              return done(null, false)
            }
          })
        }
        if(!user){
          return done(null, false);
        }
      })
      .catch(err => done(err));
  }
));


router.get('/',siteController.index);
router.get('/phim/:slug',CategoryController.detail);
router.post('/booking',middlewarePrivate,CategoryController.booking);
router.post('/payment',CategoryController.pay);
router.post('/finally',CategoryController.finally);

router.get('/login',siteController.login);
router.post('/login',siteController.handleLogin);
router.get('/redgister',siteController.redgister);
router.post('/redgister',siteController.handlecreateUser);
router.get('/myaccount',siteController.myaccount);

module.exports = router;