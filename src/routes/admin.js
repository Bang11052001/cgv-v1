const { Router } = require('express');
const express = require('express');
const router = express.Router();
const filmsController = require('../controller/filmsController');
const menuController = require('../controller/menuController');
const slidesController = require('../controller/slidesController');
const qualitiesController = require('../controller/qualitiesController');
const cinemasControler = require('../controller/cinemasControler');
const areasController = require('../controller/areasController');
const roomsController = require('../controller/roomsController');
const showTimesController = require('../controller/showTimesController');
const seatsController = require('../controller/seatsController');
const usersController = require('../controller/userController');
const siteController = require('../controller/siteAdminController');
const genresController = require('../controller/genresController');
const filmCategoryController = require('../controller/filmCategoryController');
const newsCategoryController = require('../controller/newsCategoryController');
const newsController = require('../controller/newsController');
const seatsTypeController = require('../controller/seatsTypeController');
const receiptController = require('../controller/receiptController');

const multer = require('multer');

//set up multer for storing uploaded files
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
  
const upload = multer({ storage: storage });

//site admin
router.get('/login',siteController.login);  
router.post('/login',siteController.handleLogin);  

// trang chủ
router.get('/',siteController.index);  

//films 
router.get('/films',filmsController.index);  
router.get('/films/detail',filmsController.detail);  
router.post('/films',upload.single('file_image'),filmsController.handleCreate);  
router.patch('/films',upload.single('file_image'),filmsController.handleUpdate);  
router.get('/films/update',filmsController.update);  
router.get('/films/delete',filmsController.handleDelete); 
router.get('/films/create',filmsController.create); 

// news categories
router.get('/newsCategories',newsCategoryController.index); 
router.post('/newsCategories/create',newsCategoryController.handleCreate); 
router.patch('/newsCategories',newsCategoryController.handleUpdate); 
router.get('/newsCategories/update',newsCategoryController.update);  
router.get('/newsCategories/delete',newsCategoryController.delete); 
router.get('/newsCategories/create',newsCategoryController.create);

// film categories
router.get('/filmCategories',filmCategoryController.index); 
router.post('/filmCategories/create',filmCategoryController.handleCreate); 
router.patch('/filmCategories',filmCategoryController.handleUpdate); 
router.get('/filmCategories/update',filmCategoryController.update);  
router.get('/filmCategories/delete',filmCategoryController.delete); 
router.get('/filmCategories/create',filmCategoryController.create);

// menu
router.get('/menus',menuController.index); 
router.post('/menus/create',menuController.handleCreate); 
router.patch('/menus',menuController.handleUpdate); 
router.get('/menus/update',menuController.update);  
router.delete('/menus/delete',menuController.delete); 


// slides
router.get('/slides',slidesController.index); 
router.post('/slides',upload.single('file_image'),slidesController.handleCreate); 
router.patch('/slides',upload.single('file_image'),slidesController.handleUpdate); 
router.get('/slides/update',slidesController.update);  
router.get('/slides/delete',slidesController.delete); 
router.get('/slides/create',slidesController.create); 

// qualities
router.get('/qualities',qualitiesController.index); 
router.post('/qualities',qualitiesController.handleCreate); 
router.patch('/qualities',qualitiesController.handleUpdate); 
router.get('/qualities/update',qualitiesController.update);  
router.get('/qualities/delete',qualitiesController.delete); 
router.get('/qualities/create',qualitiesController.create); 

// genres
router.get('/genres',genresController.index); 
router.post('/genres',genresController.handleCreate); 
router.patch('/genres',genresController.handleUpdate); 
router.get('/genres/update',genresController.update);  
router.get('/genres/delete',genresController.delete); 
router.get('/genres/create',genresController.create); 

// cinemas
router.get('/cinemas',cinemasControler.index); 
router.post('/cinemas',cinemasControler.handleCreate); 
router.patch('/cinemas',cinemasControler.handleUpdate); 
router.get('/cinemas/update',cinemasControler.update);  
router.get('/cinemas/delete',cinemasControler.delete); 
router.get('/cinemas/create',cinemasControler.create); 

// areas
router.get('/areas',areasController.index); 
router.post('/areas',areasController.handleCreate); 
router.patch('/areas',areasController.handleUpdate); 
router.get('/areas/update',areasController.update);  
router.get('/areas/delete',areasController.delete); 
router.get('/areas/create',areasController.create); 

// rooms
router.get('/rooms',roomsController.index); 
router.post('/rooms',roomsController.handleCreate); 
router.patch('/rooms',roomsController.handleUpdate); 
router.get('/rooms/update',roomsController.update);  
router.get('/rooms/delete',roomsController.delete); 
router.get('/rooms/create',roomsController.create); 

// show times
router.get('/showTimes',showTimesController.index); 
router.post('/showTimes',showTimesController.handleCreate); 
router.patch('/showTimes',showTimesController.handleUpdate); 
router.get('/showTimes/update',showTimesController.update);  
router.get('/showTimes/delete',showTimesController.delete); 
router.get('/showTimes/create',showTimesController.create); 
router.post('/showTimes/create/quality',showTimesController.handleQualityreate); 

// seats type
router.get('/seats-type',seatsTypeController.index); 
router.post('/seats-type/create',seatsTypeController.handleCreate); 
router.patch('/seats-type',seatsTypeController.handleUpdate); 
router.get('/seats-type/update',seatsTypeController.update);  
router.get('/seats-type/delete',seatsTypeController.delete); 
router.get('/seats-type/create',seatsTypeController.create); 

// seats
router.get('/seats',seatsController.index); 
router.post('/seats',seatsController.handleCreate); 
router.patch('/seats',seatsController.handleUpdate); 
router.get('/seats/update',seatsController.update);  
router.get('/seats/delete',seatsController.delete); 
router.get('/seats/create',seatsController.create); 

// adminds
router.get('/users',usersController.index); 
router.post('/users',usersController.handleCreate); 
router.patch('/users',usersController.handleUpdate); 
router.get('/users/update',usersController.update);  
router.get('/users/delete',usersController.delete); 
router.get('/users/create',usersController.create); 

// news
router.get('/news',newsController.index); 
router.post('/news',newsController.handleCreate); 
router.patch('/news',newsController.handleUpdate); 
router.get('/news/update',newsController.update);  
router.get('/news/delete',newsController.delete); 
router.get('/news/create',newsController.create); 

// users
router.get('/receipts',receiptController.index); 
router.post('/receipts',receiptController.handleCreate); 
router.patch('/receipts',receiptController.handleUpdate); 
router.get('/receipts/update',receiptController.update);  
router.get('/receipts/delete',receiptController.delete); 
router.get('/receipts/create',receiptController.create); 
router.get('/receipts/detail',receiptController.detail); 

module.exports = router;


