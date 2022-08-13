const Receipt = require('../modules/receipt')
const fs = require('fs');
const path = require('path');

var userController={
    index(req,res,next) {
        Receipt.find()
            .then((receipts) => {
                receipts = receipts.map(curr => curr.toObject());
                res.render('admin/receipt/index',{
                    layout: 'main2',
                    receipts
                });
            })
            .catch(error => next(error));
    },
    detail(req,res,next){
        Receipt.findById({_id: req.query.id})
            .then((receipt) => {
                receipt = receipt.toObject();
                res.render('admin/receipt/detail',{
                    layout: 'main2',
                    receipt
                });
            })
            .catch(error => next(error));
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
    delete(req,res,next) {
        Receipt.deleteOne({_id : req.query.id})
            .then(() =>{
                res.redirect('/admin/receipts');
            })
            .catch(err => next(err));
    },
}
module.exports = userController;