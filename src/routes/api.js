const express = require('express');
const { Router } = require('express');
const router = express.Router();
const apiController = require('../controller/apiController.js');

router.get('/v1/cinemas/rooms/show-times',apiController.getShowTimes);
router.get('/menus',apiController.getMenus);
router.get('/cinema',apiController.showCinema);
router.post('/user',apiController.showUser);
router.get('/v1/films/:id',apiController.getFilm);


module.exports = router;



