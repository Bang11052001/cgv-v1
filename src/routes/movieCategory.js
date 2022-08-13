const { Router } = require('express');
const express = require('express');
const router = express.Router();
const CategoryController = require('../controller/categoryController');
const middlewarePrivate = require('../middleware/middlewarePrivate');

router.get('/:slug',CategoryController.show);

module.exports = router;



