const Film = require('../modules/films');
const Genre = require('../modules/genre');
const Quality = require('../modules/quality');
const FilmCategory = require('../modules/filmCategory');
const handleShowCategories = require('../utils/handleShowCategories');
const handleFilmFieldUpdate = require('../utils/handleFilmFieldUpdate');
const generateSlug = require('../utils/generateSlug');
const checkArr = require('../utils/checkArr');
const fs = require('fs');
const path = require('path');
const genre = require('../modules/genre');

var filmsController={
    index(req,res,next) {
        Film.find()
            .then(films =>{
                films = films.map(film => film.toObject());
                res.render('admin/films/index',{
                    layout: 'main2',
                    films: films
                });
            })
            .catch(err => next(err));
    },
    handleDelete(req,res,next) {
        Film.deleteOne({_id : req.query.id})
            .then(function() {
                res.redirect('/admin/films');
            })
            .catch(err => next(err));
    },
    create(req,res,next) {
        Promise.all([Genre.find({status: true}), Quality.find({status: true}),FilmCategory.find({status: true})])
            .then(([genres,qualities,filmCategories]) => {
                genres = genres.map(genre => genre.toObject());
                filmCategories = filmCategories.map(filmCategory => filmCategory.toObject());
                qualities = qualities.map(quality => quality.toObject());
                res.render('admin/films/create',{
                    layout: 'main2',
                    genres,
                    qualities,
                    filmCategories : handleShowCategories(filmCategories)
                });
            })
            .catch(err => next(err));
    },
    handleCreate(req,res,next) {
        Promise.all([
            Genre.find({_id: {'$in': req.body.genre_id}}),
            Quality.find({_id: {'$in': req.body.quality_id}}),
            FilmCategory.find({_id: {'$in': req.body.category_id}}),
        ])
            .then(([genres,qualities,filmCategories]) => {
                genres = genres.map(curr => curr.toObject());
                qualities = qualities.map(curr => curr.toObject());
                filmCategories = filmCategories.map(curr => curr.toObject());
                var img =  fs.readFileSync(req.file.path).toString('base64');
                
                // slug
                if(req.body.slug == ''){
                    req.body.slug = generateSlug(req.body.name)
                }

                const film = new Film(req.body);

                // upload ảnh
                film.image = {
                            data : img,
                            contentType: req.file.mimetype
                        }
                
                genres.map(curr => {
                    film.genre.push(curr);
                })

                qualities.map(curr => {
                    film.quality.push(curr);

                })
                
                filmCategories.map(curr => {
                    film.category.push(curr);

                })
                // lưu phim
                film.save()
                    .then(() =>{
                        res.redirect('/admin/films');
                    }) 
                    .catch(err => res.status(400).send(err.message));
            })
            .catch(err => res.status(400).send(err.message));
    },
    update(req,res,next) {
        Promise.all([Film.findById({_id : req.query.id}),
        FilmCategory.find({status: true}),
        Genre.find({status: true}),
        Quality.find({status: true}),
    ])
        .then(([film, filmCategories,genres,qualities]) => {
            film = film.toObject();
            genres =  genres.map(curr => curr.toObject());
            qualities =  qualities.map(curr => curr.toObject());
            filmCategories = filmCategories.map(filmCategory => filmCategory.toObject());
            
            // xử lý danh sách thể loại phim
            genres = handleFilmFieldUpdate(genres,film.genre)

            // xử lý danh sách chất lượng phim
            qualities = handleFilmFieldUpdate(qualities,film.quality)

            // Xử lý danh sách danh mục phim
            filmCategories = handleFilmFieldUpdate(handleShowCategories(filmCategories),film.category)

            res.render('admin/films/update',{
                layout: 'main2',
                film: film,
                filmCategories,
                genres,
                qualities
            });
        })
        .catch(err => next(err));
    },
    handleUpdate(req,res,next) {
        Promise.all([
            Genre.find({_id: {'$in': req.body.genre_id}}),
            Quality.find({_id: {'$in': req.body.quality_id}}),
            FilmCategory.find({_id: {'$in': req.body.category_id}}),
        ])
            .then(([genres,qualities,filmCategories]) => {
                var img =  fs.readFileSync(req.file.path).toString('base64');
                req.body.image = {
                    data : img,
                    contentType: req.file.mimetype
                }
                    Film.updateOne({_id : req.query.id},req.body)
                        .then((doc) =>{
                            Film.findById({_id: req.query.id})
                                .then((film) => {
                                    film.quality =[];
                                    film.genre =[];
                                    film.category =[];
                    
                                    // thêm các trường vào obj
                                    genres.map(curr => {
                                        film.genre.push(curr);
                                    })
                                    qualities.map(curr => {
                                        film.quality.push(curr);
                                    })
                                    filmCategories.map(curr => {
                                        film.category.push(curr);
                                    })
                                    
                                    film.save(function(saveerr,saveresult){
                                        if(!saveerr){
                                            res.redirect('/admin/films');
                                        }
                                        else{
                                            console.log(saveresult.message);
                                        }
                                    })
                                })
                                .catch((err) =>{
                                    res.status(400).send(err.massage);
                                });
                        })
                        .catch((err) => {
                            console.log(err.message);
                        })

            })

     
    },
    detail(req,res,next){
        Film.find({_id : req.query.id})
            .then(films =>{
                films = films.map(film => film.toObject());
                res.render('admin/films/detail',{
                    layout : 'main2', 
                    films
                })
            })
            .catch(err => next(err));
    },
}

module.exports = filmsController;