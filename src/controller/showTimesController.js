const { populate } = require('../modules/category');
const ShowTime = require('../modules/showtime')
const Room = require('../modules/room')
const Film = require('../modules/films')

var showTimeController={
    index(req,res,next) {
        Promise.all([ShowTime.find({room_id: req.query.room_id,cinema_id : req.query.cinema_id}).populate('film_id').populate('quality_id'),Room.findById({_id: req.query.room_id})])
            .then(([showTimes,room]) => {
                var room_id = req.query.room_id;
                var cinema_id = req.query.cinema_id;
                    showTimes = showTimes.map(showTime => showTime.toObject());
                    room = room.toObject();
                    res.render('admin/showTimes/index',{
                        layout: 'main2',
                        showTimes,
                        room_id,
                        cinema_id,
                        room
                });
            })
            .catch(error => next(error));
    },
    update(req,res,next) {
        ShowTime.findById({_id : req.query.showtime_id,})
        .then(showTime =>{
            showTime = showTime.toObject();
            res.render('admin/showTimes/update',{
                layout: 'main2',
                showTime
            });
        })
        .catch(err => next(err));
    },
    delete(req,res,next) {
        ShowTime.deleteOne({_id : req.query.showtime_id})
            .then(() =>{
                res.redirect('/admin/showTimes?cinema_id='+ req.query.cinema_id +'&room_id='+ req.query.room_id);
            })
            .catch(err => next(err));
    },
    create(req,res,next) {
        Film.find({status: 1, category: 'Phim đang chiếu'}).populate('quality._id')
            .then((films) =>{
                var room_id = req.query.room_id;
                var cinema_id = req.query.cinema_id;
                films = films.map(film => film.toObject());
                res.render('admin/showTimes/create',{
                    layout: 'main2',
                    films,
                    room_id,
                    cinema_id
                });
            })
            .catch(err => next(err));
    },
    handleQualityreate(req,res,next) {
        Film.find({status: 1, category: 'Phim đang chiếu',_id: req.query.id}).populate('quality._id')
        .then((film) =>{
            var room_id = req.query.room_id;
            var cinema_id = req.query.cinema_id;
            film = film.map(film => film.toObject());
            res.render('admin/showTimes/create',{
                layout: 'main2',
                film,
                room_id,
                cinema_id
            });
        })
        .catch(err => next(err));
    },
    handleCreate(req,res,next) {
        const showTime = new ShowTime(req.body);
        showTime.room_id = req.query.room_id;
        showTime.cinema_id = req.query.cinema_id;
        showTime.save()
            .then(() =>{
                res.redirect('/admin/showTimes/create?cinema_id='+ req.query.cinema_id +'&room_id='+ req.query.room_id);
            })
    },
    handleUpdate(req,res,next) {
        ShowTime.updateOne({_id : req.query.id},req.body) 
            .then(() =>{
                res.redirect('/admin/showTimes');
            })
    },
}
module.exports = showTimeController;