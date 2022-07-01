const Film = require('../modules/films');
const Slide = require('../modules/slides');
const User = require('../modules/user');
const Area = require('../modules/area');
const Cinema = require('../modules/cinemas');

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
    handleLogin(req,res,next){
        User.find({email: req.body.email, password : req.body.password})
            .then(user =>{
                if(user.length > 0){
                    res.redirect('/');
                }
                else{   
                    res.render('pages/login',{
                        alert: 'Thông tin đăng nhập không đúng!'
                    })
                }
            })
    },
    handlecreateUser(req,res,next){
        const user = new User(req.body)
        user.date = req.body.day +'/'+req.body.date+'/'+req.body.year
        user.save()
            .then(user => {
                // res.redirect('back');
                res.json(req.body)
            })
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