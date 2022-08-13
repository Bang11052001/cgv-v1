const NewsCategory = require('../modules/newsCategory');
const News = require('../modules/news');
const handleShowCategories = require('../utils/handleShowCategories');
const handleUpdateCategories = require('../utils/handleUpdateCategories');
const handleFilmFieldUpdate = require('../utils/handleFilmFieldUpdate');


var newsCategoryController={
    index(req,res,next) {
        Promise.all([NewsCategory.find(),News.find()]) 
            .then(([NewsCategories,news]) => {
                NewsCategories = NewsCategories.map(NewsCategory => NewsCategory.toObject());  
                res.render('admin/newsCategories',{
                    layout: 'main2',
                    newsCategories : handleShowCategories(NewsCategories, news)
                });
            })
            .catch(error => next(error));
    },
    update(req,res,next) {
        Promise.all([NewsCategory.findById({_id : req.query.id}),NewsCategory.find()])
        .then(([newsCategory,newsCategories]) =>{
            newsCategory = newsCategory.toObject();
            newsCategories = newsCategories.map(newsCategory => newsCategory.toObject());

            newsCategories = handleUpdateCategories(newsCategories,newsCategory).map(curr => {
                if(newsCategory.parent_id == curr._id){
                    curr.selected = true;
                }
                else{
                    curr.selected = false;
                }
                return curr;
            })
            
            res.render('admin/newsCategories/update',{
                layout: 'main2',
                newsCategory,
                newsCategories,
            });
        })
        .catch(err => next(err));
    },
    delete(req,res,next) {
        NewsCategory.deleteOne({_id : req.query.id})
            .then(() =>{
                res.redirect('/admin/newsCategories');
            })
            .catch(err => next(err));
    },
    create(req,res,next) {
        NewsCategory.find()
            .then(newsCategories =>{
                newsCategories = newsCategories.map(newsCategory => newsCategory.toObject());
                res.render('admin/newsCategories/create',{
                    layout: 'main2',
                    newsCategories : handleShowCategories(newsCategories)
                });
            })
            .catch(err => next(err));
    },
    handleCreate(req,res,next) {
        if(req.body.slug === ''){
            req.body.slug = req.body.name.trim().split(' ').join('-');
        }
        const newsCategory = new NewsCategory(req.body);
        newsCategory.save()
            .then(() =>{
                res.redirect('/admin/newsCategories/create');
            })
    },
    handleUpdate(req,res,next) {
        NewsCategory.updateOne({_id : req.query.id},req.body)
            .then(() =>{
                res.redirect('/admin/newsCategories');
            })
            .catch(err => next(err))
    },
}
module.exports = newsCategoryController;