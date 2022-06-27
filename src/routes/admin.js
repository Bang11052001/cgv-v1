const { Router } = require('express');
const express = require('express');
const router = express.Router();
const filmsController = require('../controller/filmsController');
const categoryItemController = require('../controller/categoryItemControler');
const subCategoryController = require('../controller/subCategoryController');
const slidesController = require('../controller/slidesController');
const qualitiesController = require('../controller/qualitiesController');
const cinemasControler = require('../controller/cinemasControler');
const areasController = require('../controller/areasController');
const roomsController = require('../controller/roomsController');
const showTimesController = require('../controller/showTimesController');
const seatsController = require('../controller/seatsController');
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


//films admin
router.get('/',filmsController.index);  
router.get('/films',filmsController.films);  
router.post('/films',upload.single('file_image'),filmsController.handleFilmsCreate);  
router.patch('/films',upload.single('file_image'),filmsController.handlefilmsUpdate);  
router.get('/films/update',filmsController.filmsUpdate);  
router.get('/films/delete',filmsController.filmsDelete); 
router.get('/films/create',filmsController.filmsCreate); 

// categorys
router.get('/categorys',categoryItemController.index); 
router.post('/categorys',categoryItemController.handleCreate); 
router.patch('/categorys',categoryItemController.handleUpdate); 
router.get('/categorys/update',categoryItemController.update);  
router.get('/categorys/delete',categoryItemController.delete); 
router.get('/categorys/create',categoryItemController.create); 

// subcategorys
router.post('/subcategorys',subCategoryController.handleCreate); 
router.patch('/subcategorys',subCategoryController.handleUpdate); 
router.get('/subcategorys/update',subCategoryController.update);  
router.get('/subcategorys/delete',subCategoryController.delete); 
router.get('/subcategorys/create',subCategoryController.create); 

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

// seats
router.get('/seats',seatsController.index); 
router.post('/seats',seatsController.handleCreate); 
router.patch('/seats',seatsController.handleUpdate); 
router.get('/seats/update',seatsController.update);  
router.get('/seats/delete',seatsController.delete); 
router.get('/seats/create',seatsController.create); 

module.exports = router;


