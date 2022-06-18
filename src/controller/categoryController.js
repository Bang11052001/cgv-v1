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
            Promise.all([ShowTime.find({status: 1,film_id: req.query.id}).populate(['cinema_id', 'room_id','film_id','quality_id',{path: 'cinema_id',populate: {path: 'area'}}]),Film.findById({_id: req.query.id} )])
            .then(([showTimes,film]) => {
                showTimes = showTimes.map(showTime => showTime.toObject());
                film = film.toObject();
                res.render('pages/fiml',{
                    showTimes,
                    film
                });
            })
    },
    booking(req,res,next) {
        res.render('pages/booking');
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
                Film.find({status:1,category : req.query.type}),
                ShowTime.find({status: 1,film_id: req.query.film_id,date: req.query.date}).populate({path: 'cinema_id',populate: 'area'})
            ]
        )
            .then(([films,showTimes1]) =>{
                console.log(req.query)
                films = films.map(film => film.toObject());
                showTimes1 = showTimes1.map(showTime => showTime.toObject());
                res.render('pages/bookingTicket',{
                    films,
                    showTimes1
                });
            })
            .catch(err => next(err));
    },
    bookingTicket(req,res,next) {
        Promise.all(
            [
                    ShowTime.find({status: 1,film_id: req.query.id}).populate(['cinema_id', 'room_id','film_id','quality_id',{path: 'cinema_id',populate: {path: 'area'}}]),
                    Film.findById({_id: req.query.id} )
            ]
        )
            .then(([showTimes,film]) => {
                showTimes = showTimes.map(showTime => showTime.toObject());
                film = film.toObject();
                res.render('pages/bookingTicket',{
                    showTimes,
                    film
                });
            })
    }
}

module.exports = categoryController;