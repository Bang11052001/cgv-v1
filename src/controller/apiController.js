const ShowTime = require('../modules/showtime');
const Room = require('../modules/room');
const Cinema = require('../modules/cinemas');
const User = require('../modules/user');
const Menu = require('../modules/menu');
const Film = require('../modules/films');
const { Legend } = require('chart.js');
const { reset } = require('nodemon');

var apiController = {
    getShowTimes(req,res,next){
        Cinema.find({status: 1})
                .then(cinemas =>{
                    var result = [];
                    cinemas = cinemas.map(curr => curr.toObject());
                    if(req.query.date && req.query.film_id){

                        cinemas = cinemas.filter(cinema => {
                            cinema.rooms = cinema.rooms.filter(room => {
                                room.showTimes = room.showTimes.filter(showTime => {
                                    if(showTime.film._id == req.query.film_id && showTime.date == req.query.date){
                                        return true;
                                    }
                                    else{
                                        return false;
                                    }
                                })
                                if(room.showTimes.length > 0){
                                    return true;
                                }
                            })
                            if(cinema.rooms.length > 0){
                                return true;
                            }
                        })

                    }

                    res.json(cinemas);
                })
                .catch(err => res.status(400).send(err.message));
    },
    showCinema(req,res,next){
        Cinema.find({status: 1,area : req.query.site})
            .then(cinema =>{
                res.json(cinema);
            })
            .catch(err => res.status(400).send(err.message));
    },
    showUser(req,res,next){
        if(req.body.email){
            User.find({status: 1,email: req.body.email})
            .then(user =>{
                res.json(user);
            })
            .catch(err => next(err));
        }
        if(req.body.phone){
            User.find({status: 1,phone: req.body.phone})
            .then(user =>{
                res.json(user);
            })
            .catch(err => next(err));
        }
    },
    getLengthParentId(req,res,next){
        Promise.all([Menu.findById({_id : req.query.id}),Menu.find({status: true})])
            .then(([menu,menus]) => {
                menu = menu.toObject();
                menus = menus.map(curr => curr.toObject());

               if(menu.name == "Trống" ){
                    menus = menus.filter(curr => {
                        if(curr.parent_id == 0){
                            return true;
                        }
                    })
                }
                else{
                    menus = menus.filter(curr =>{
                        if(curr.parent_id == menu._id && curr.parent_id != 0){
                            return true;
                        }
                    });  
                    menus.length = menus.length + 1;
                }
                
                res.json({
                    length: menus.length
                });
            })
            .catch(err => res.status(400).send(err.message));
    },
    getMenus(req,res,next){
        Menu.find()
            .then(menus => {
                menus = menus.map(curr => curr.toObject());
                res.json(menus)
            })
            .catch(err => res.status(400).send(err.message));
    },
    getFilm(req,res,next){
        Film.findById({_id: req.params.id})
            .then(film => {
                film = film.toObject();
                res.status(200).json(film);
            })
            .catch(err => res.status(500).send(err.message));
    }
    
}

module.exports = apiController;