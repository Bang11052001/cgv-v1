const Film = require('../modules/films')
const fs = require('fs');
const path = require('path');

var filmsController={
    index(req,res,next) {
        res.render('admin/index',{
            layout: 'main2'
        });
    },
    films(req,res,next) {
        Film.find().populate([{path: 'quality',populate: '_id'},'sub_category'])
            .then(films =>{
                films = films.map(film => film.toObject());
                res.render('admin/films/films',{
                    layout: 'main2',
                    films: films
                });
            })
            .catch(err => next(err));
    },
    filmsDelete(req,res,next) {
        Film.deleteOne({_id : req.query.id})
            .then(function() {
                res.redirect('/admin/films');
            })
            .catch(err => next(err));
    },
    filmsUpdate(req,res,next) {
        Film.findById({_id : req.query.id}).populate({path: 'quality',populate: '_id'})
            .then(film => {
                film = film.toObject();
                res.render('admin/films/filmsupdate',{
                    layout: 'main2',
                    film: film
                });
            })
            .catch(err => next(err));
    }
    ,filmsCreate(req,res,next) {
        res.render('admin/films/filmscreate',{
            layout: 'main2',
        });
    },
    handleFilmsCreate(req,res,next) {
        if(req.body.quality_id){
            var quality_id = req.body.quality_id.split(',');
        }
        var img =  fs.readFileSync(req.file.path).toString('base64');
        const film = new Film(req.body);
        quality_id.map(curr => {
            film.quality.push({_id: curr});
        })
        
        film.image = {
            data : img,
            contentType: req.file.mimetype
        }
        film.save()
            .then(() =>{
                res.redirect('/admin/films');
            })
    },
    handlefilmsUpdate(req,res,next) {
        console.log(req.body)

        var img =  fs.readFileSync(req.file.path).toString('base64');
        const formData = req.body;
        formData.quality =[];
        req.body.image = {
            data : img,
            contentType: req.file.mimetype
        }
        if(req.body.quality_id){
            var quality_id = req.body.quality_id.split(',');
            quality_id.map(item => {
               formData.quality.push({_id : item})
            })
        }
        console.log(formData)
        Film.updateOne({_id : req.query.id},formData)
        .then((film) => {
            res.redirect('/admin/films');
        })
        .catch(err => next(err));
    },
}

module.exports = filmsController;