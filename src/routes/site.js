const { Router } = require('express');
const express = require('express');
const router = express.Router();
const siteController = require('../controller/siteController.js');

router.get('/',siteController.index);
router.get('/login',siteController.login);
router.post('/login',siteController.handleLogin);
router.post('/redgister',siteController.handlecreateUser);
router.get('/redgister',siteController.redgister);
router.get('/myaccount',siteController.myaccount);

module.exports = router;