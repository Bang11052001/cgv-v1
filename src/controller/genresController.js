const Genre = require('../modules/genre')

var GenresController={
    index(req,res,next) {
        Genre.find()
        .then((genres) => {
            genres = genres.map(genre => genre.toObject());
            res.render('admin/genres/index',{
                layout: 'main2',
                genres
            });
        })
        .catch(error => next(error));
    },
    update(req,res,next) {
        Genre.findById({_id : req.query.id})
        .then(genre =>{
            genre = genre.toObject();
            res.render('admin/genres/update',{
                layout: 'main2',
                genre
            });
        })
        .catch(err => next(err));
    },
    delete(req,res,next) {
        Genre.deleteOne({_id : req.query.id})
            .then(() =>{
                res.redirect('/admin/genres');
            })
            .catch(err => next(err));
    },
    create(req,res,next) {
        res.render('admin/genres/create',{
            layout: 'main2',
        });
    },
    handleCreate(req,res,next) {
        const genre = new Genre(req.body);
        genre.save()
            .then(() =>{
                res.redirect('/admin/genres/create');
            })
    },
    handleUpdate(req,res,next) {
        Genre.updateOne({_id : req.query.id},req.body)
            .then(() =>{
                res.redirect('/admin/genres');
            })
            .catch(err => next(err))
    },
}
module.exports = GenresController;