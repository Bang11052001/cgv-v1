const SeatType = require('../modules/seatType')
const handleShowCategories = require('../utils/handleShowCategories');
const handleUpdateCategories = require('../utils/handleUpdateCategories');
const generateSlug = require('../utils/generateSlug');
const handleFilmFieldUpdate = require('../utils/handleFilmFieldUpdate');


var seatsTypeController={
    index(req,res,next) {
        SeatType.find()
            .then((seatsType) => {
                seatsType = seatsType.map(curr => curr.toObject());
                res.render('admin/seatsType',{
                    layout: 'main2',
                    seatsType
                });
            })
            .catch(error => next(error));
    },
    create(req,res,next) {
        res.render('admin/seatsType/create',{
            layout: 'main2',
        })
    },
    handleCreate(req,res,next) {
        const seatType = new SeatType(req.body);
        seatType.save()
            .then(() =>{
                res.redirect('/admin/seats-type/create');
            })
            .catch(error => next(error));
    },
    update(req,res,next) {
        SeatType.findById({_id : req.query.id})
            .then(seatType =>{
                seatType = seatType.toObject();
                res.render('admin/seatsType/update',{
                    layout: 'main2',
                    seatType,
                });
            })
            .catch(err => next(err));
    },
    handleUpdate(req,res,next) {
        console.log(req.body)
        SeatType.updateOne({_id : req.query.id},req.body)
            .then(() =>{
                res.redirect('/admin/seats-type');
            })
            .catch(err => next(err))
    },
    delete(req,res,next) {
        SeatType.deleteOne({_id : req.query.id})
            .then(() =>{
                res.redirect('/admin/seats-type');
            })
            .catch(err => next(err));
    },
}
module.exports = seatsTypeController;