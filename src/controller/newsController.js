const News = require('../modules/news')
const NewsCategory = require('../modules/newsCategory');
const fs = require('fs');
const path = require('path');
const handleShowCategories = require('../utils/handleShowCategories');
const handleFilmFieldUpdate = require('../utils/handleFilmFieldUpdate');
const checkArr = require('../utils/checkArr');

var newsController={
    index(req,res,next) {
        News.find().populate({path: 'category',populate: '_id'})
            .then((news) => {
                news = news.map(news => news.toObject());
                res.render('admin/news',{
                    layout: 'main2',
                    news
                });
            })
            .catch(error => next(error));
    },
    update(req,res,next) {
        Promise.all([
            News.findById({_id : req.query.id}).populate({path: 'category',populate: '_id'}),
            NewsCategory.find({status: true})
        ])
        .then(([news,newsCategories])=>{
            news = news.toObject();
            newsCategories = newsCategories.map(newsCategory => newsCategory.toObject());

            // Xử lý danh sách danh mục phim
            newsCategories = handleFilmFieldUpdate(handleShowCategories(newsCategories),news.category)
            
            res.render('admin/news/update',{
                layout: 'main2',
                newsCategories,
                news
            });
        })
        .catch(err => next(err));
    },
    delete(req,res,next) {
        News.deleteOne({_id : req.query.id})
            .then(() =>{
                res.redirect('/admin/news');
            })
            .catch(err => next(err));
    },
    create(req,res,next) {
        NewsCategory.find({status: true})
            .then(newCategories => {
                newCategories = newCategories.map(newCategory => newCategory.toObject());
                res.render('admin/news/create',{
                    layout: 'main2',
                    newCategories : handleShowCategories(newCategories)
                });
            })
            .catch(err => next(err))
    },
    handleCreate(req,res,next) {
        const news = new News(req.body);

        req.body.category_id.map(curr => {
            news.category.push({_id: curr});
        })

        news.save()
            .then(() =>{
                res.redirect('/admin/news/create');
            })
    },
    
    handleUpdate(req,res,next) {
        News.updateOne({_id : req.query.id},req.body,function(err, result){
            if(!err){
                console.log('cap nhat thanh cong');
            }
            else{
                console.log(err.message)
            }
        })
        News.findById({_id: req.query.id})
            .then((news) => {
                news.category =[];
  
                req.body.category_id = checkArr(req.body.category_id);
                
                req.body.category_id.map(curr => {
                    news.category.push({_id: curr});
                })

                news.save(function(err,result){
                    if(!err){
                        console.log('luu thanh cong');
                    }
                    else{
                        console.log(err.message)
                    }
                })
                res.redirect('/admin/news');
            })
            .catch(err => res.status(400).send(err.message));
    },
}
module.exports = newsController;