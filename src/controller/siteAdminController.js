const Slide = require('../modules/slides')
const fs = require('fs');
const path = require('path');

var siteController={
    index(req,res,next) {
        res.render('admin/index',{
            layout: 'main2'
        });
    },
    login(req,res,next) {
        res.render('admin/login',{
            layout: ''
        });
    },
    handleLogin(req,res,next) {
        res.render('admin/login');
    },
}

module.exports = siteController;