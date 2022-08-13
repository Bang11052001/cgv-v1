const FilmCategory = require('../modules/filmCategory')
const handleShowCategories = require('../utils/handleShowCategories');
const handleUpdateCategories = require('../utils/handleUpdateCategories');
const generateSlug = require('../utils/generateSlug');
const handleFilmFieldUpdate = require('../utils/handleFilmFieldUpdate');


var filmCategoryController={
    index(req,res,next) {
        FilmCategory.find()
        .then((filmCategories) => {
            filmCategories = filmCategories.map(filmCategory => filmCategory.toObject());
            res.render('admin/filmCategories',{
                layout: 'main2',
                filmCategories : handleShowCategories(filmCategories)
            });
        })
        .catch(error => next(error));
    },
    update(req,res,next) {
        Promise.all([FilmCategory.findById({_id : req.query.id}),FilmCategory.find()])
        .then(([filmCategory,filmCategories]) =>{
            filmCategory = filmCategory.toObject();
            filmCategories = filmCategories.map(filmCategory => filmCategory.toObject());

            filmCategories = handleUpdateCategories(filmCategories,filmCategory).map(curr => {
                if(filmCategory.parent_id == curr._id){
                    curr.selected = true;
                }
                else{
                    curr.selected = false;
                }
                return curr;
            })
            
            res.render('admin/filmCategories/update',{
                layout: 'main2',
                filmCategory,
                filmCategories,
            });
        })
        .catch(err => next(err));
    },
    delete(req,res,next) {
        FilmCategory.deleteOne({_id : req.query.id})
            .then(() =>{
                res.redirect('/admin/filmCategories');
            })
            .catch(err => next(err));
    },
    create(req,res,next) {
        FilmCategory.find()
            .then(filmCategories =>{
                filmCategories = filmCategories.map(filmCategory => filmCategory.toObject());
                res.render('admin/filmCategories/create',{
                    layout: 'main2',
                    filmCategories : handleShowCategories(filmCategories)
                });
            })
            .catch(err => next(err));
    },
    handleCreate(req,res,next) {
        if(req.body.slug === ''){
            req.body.slug = generateSlug(req.body.name);
        }
        const filmCategory = new FilmCategory(req.body);
        filmCategory.save()
            .then(() =>{
                res.redirect('/admin/filmCategories/create');
            })
    },
    handleUpdate(req,res,next) {
        FilmCategory.updateOne({_id : req.query.id},req.body)
            .then(() =>{
                res.redirect('/admin/filmCategories');
            })
            .catch(err => next(err))
    },
}
module.exports = filmCategoryController;