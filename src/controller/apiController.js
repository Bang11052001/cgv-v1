const ShowTime = require('../modules/showtime')
const Room = require('../modules/room')

var apiController = {
    show(req,res,next){
        ShowTime.find({status: 1, film_id: req.query.film_id, date : req.query.date})
            .populate(['cinema_id', 'room_id','film_id','quality_id',{path: 'cinema_id',populate: {path: 'area'}}])
                .then(showTimes =>{
                    res.json(showTimes);
                })
    },
    show(req,res,next){
        ShowTime.find({status: 1, film_id: req.query.film_id, date : req.query.date})
            .populate(['cinema_id', 'room_id','film_id','quality_id',{path: 'cinema_id',populate: {path: 'area'}}])
                .then(showTimes =>{
                    res.json(showTimes);
                })
    },
    
}

module.exports = apiController;