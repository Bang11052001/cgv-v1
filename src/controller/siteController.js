const Film = require('../modules/films');
const Slide = require('../modules/slides');
const User = require('../modules/user');
const Area = require('../modules/area');
const Cinema = require('../modules/cinemas');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');

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
        Promise.all([Area.find({}),Cinema.find({})]) 
            .then(([areas,cinemas]) => {
                areas = areas.map(area => area.toObject());
                cinemas = cinemas.map(cinema => cinema.toObject());
                res.render('pages/login',{
                    areas,
                    cinemas
                })
            })
    },
    handleLogin(req,res,next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) {  
              res.json({})
            }
            if(user){
                var token = jwt.sign(user.toObject(), 'mk',{ expiresIn: 15 * 60 });
                res.json(
                    {
                        token : token,
                        urlRedirect : '/login',
                    });
            }
          })(req, res, next);
    },
    handlecreateUser(req,res,next){
        Cinema.findById({_id : req.body.cinema_favourite})
            .then((cinema) => {
                cinema = cinema.toObject();
                const user = new User(req.body)
                user.date = req.body.day +'/'+req.body.date+'/'+req.body.year;
                user.status =true;
                user.cinema_favourite = cinema;
                console.log(cinema)
                user.save()
                    .then(user => {
                        res.redirect('/login');
                    })
            })
            .catch(err => res.status(400).send(err.message));
    },
    redgister(req,res,next) {
        Promise.all([Area.find({}),Cinema.find({})]) 
        .then(([areas,cinemas]) => {
            areas = areas.map(area => area.toObject());
            cinemas = cinemas.map(cinema => cinema.toObject());
            res.render('pages/redgister',{
                areas,
                cinemas
            })
        })
    },
    myaccount(req,res,next) {
        res.render('pages/myaccount')
    },
    
}

module.exports = siteController;