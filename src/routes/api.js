const { Router } = require('express');
const express = require('express');
const router = express.Router();
const apiController = require('../controller/apiController.js');

router.get('/showTimes',apiController.show);


module.exports = router;



