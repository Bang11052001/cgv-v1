const { Router } = require('express');
const express = require('express');
const router = express.Router();
const CategoryController = require('../controller/categoryController.js');

router.get('/',CategoryController.show);
router.get('/film',CategoryController.detail);
router.post('/film/booking',CategoryController.booking);
router.post('/film/booking/payment',CategoryController.pay);
router.get('/film/booking/payment/finally',CategoryController.finally);

module.exports = router;



