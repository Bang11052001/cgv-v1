const { Router } = require('express');
const express = require('express');
const router = express.Router();
const CategoryController = require('../controller/categoryController.js');

router.get('/',CategoryController.show);
router.get('/film',CategoryController.detail);
router.post('/film/handleDate',CategoryController.handleDate);
router.get('/film/booking',CategoryController.booking);
router.get('/film/bookingTicket',CategoryController.bookingTicket);
router.get('/film/booking/payment',CategoryController.pay);
router.get('/film/booking/payment/finally',CategoryController.finally);

module.exports = router;



