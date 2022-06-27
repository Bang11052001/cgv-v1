const Film = require('../modules/films')
const Category = require('../modules/category')
const SubCategory = require('../modules/subCategory')
const Area = require('../modules/area')
const area = require('../modules/area')
const ShowTime = require('../modules/showtime')


var categoryController={
    show(req,res,next) {
        Promise.all([Film.find({status:1,sub_category : req.query.type}).populate('sub_category')])
            .then(([films]) =>{
                films = films.map(film => film.toObject());
                res.render('pages/category',{
                    films,
                });
            })
            .catch(err => next(err));
    },
    detail(req,res,next) {
        Film.findById({status: 1, _id :req.query.id})
            .then((film) => {
                film = film.toObject();
                res.render('pages/fiml',{
                    film
                });
            })
    },
    booking(req,res,next) {
        [req.body.time,req.body.cinema,req.body.room,req.body.date,req.body.quality] = req.body.desc.split(',');
        var filmDesc = req.body;
        console.log(filmDesc)
        Film.findById({status: 1, _id: req.query.film_id})
            .then(film => {
                film = film.toObject();
                res.render('pages/booking',{
                    film,filmDesc
                });
            })
            .catch(err => next(err));
    },
    pay(req,res,next) {
        res.render('pages/payment');
    },
    finally(req,res,next) {
        res.render('pages/finally');
    },
    handleDate(req,res,next) {
        Promise.all(
            [
                Film.find({status:1,category : req.query.type, _id: req.query.id}),
                ShowTime.find({status: 1,film_id: req.query.id,date: req.query.date}).populate({path: 'cinema_id',populate: 'area'})
            ]
        )
            .then(([film,showTimes]) =>{
                film = film.map(film => film.toObject());
                showTimes = showTimes.map(showTime => showTime.toObject());
                res.render('pages/fiml',{
                    film,
                    showTimes
                });
            })
            .catch(err => next(err));
    },
    handleArea(req,res,next) {
        Promise.all(
            [
                Film.find({status:1,category : req.query.type, _id: req.query.id}),
                ShowTime.find({status: 1,film_id: req.query.id,date: req.query.date,}).populate({path: 'cinema_id',populate: 'area'})
            ]
        )
            .then(([film,showTimes]) =>{
                film = film.map(film => film.toObject());
                showTimes = showTimes.map(showTime => showTime.toObject());
                res.render('pages/fiml',{
                    film,
                    showTimes
                });
            })
            .catch(err => next(err));
    },
}

module.exports = categoryController;