const User = require('../modules/user')
const fs = require('fs');
const path = require('path');

var userController={
    index(req,res,next) {
        User.find()
            .then((users) => {
                users = users.map(user => user.toObject());
                res.render('admin/users/index',{
                    layout: 'main2',
                    users
                });
            })
            .catch(error => next(error));
    },
    update(req,res,next) {
        Slide.findById({_id : req.query.id})
        .then(slides =>{
            slides = slides.toObject();
            res.render('admin/slides/update',{
                layout: 'main2',
                slides
            });
        })
        .catch(err => next(err));
    },
    delete(req,res,next) {
        User.deleteOne({_id : req.query.id})
            .then(() =>{
                res.redirect('/admin/users');
            })
            .catch(err => next(err));
    },
    create(req,res,next) {
        res.render('admin/slides/create',{
            layout: 'main2',
        });
    },
    handleCreate(req,res,next) {
        const slide = new Slide(req.body);
        var img =  fs.readFileSync(req.file.path).toString('base64');

        slide.image = {
            data : img,
            contentType: req.file.mimetype
        }
        slide.save()
            .then(() =>{
                res.redirect('/admin/slides/create');
            })
    },
    
    handleUpdate(req,res,next) {
        console.log(req.file)
        var img =  fs.readFileSync(req.file.path).toString('base64');
        req.body.image = {
            data : img,
            contentType: req.file.mimetype
        }
        Slide.updateOne({_id : req.query.id},req.body)
            .then(() =>{
                res.redirect('/admin/slides');
            })
            .catch(err => next(err))
    },
}
module.exports = userController;