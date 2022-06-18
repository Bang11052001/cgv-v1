const Film = require('../modules/films');
const Slide = require('../modules/slides');

var siteController={
    index(req,res,next) {
        Promise.all([Film.find({status : 1}),Slide.find({status : 1})])
            .then(([films,slides]) =>{
                films = films.map(film => film.toObject());
                slides = slides.map(slide => slide.toObject());
                res.render('pages/home',{
                    films,
                    slides
                })
            })
            .catch(err => next(err));
    },
    login(req,res,next) {
        res.render('pages/login')
    },
    redgister(req,res,next) {
        res.render('pages/redgister')
    },
    myaccount(req,res,next) {
        res.render('pages/myaccount')
    },
}

module.exports = siteController;