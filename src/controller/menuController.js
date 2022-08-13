const Menu = require('../modules/menu');
const filmCategory = require('../modules/filmCategory');
const newsCategory = require('../modules/newsCategory');
const handleShowCategories = require('../utils/handleShowCategories');
const handleUpdateCategories = require('../utils/handleUpdateCategories');

var categoryItemController={
    index(req,res,next) {
        Promise.all([
            Menu.find(),
            filmCategory.find({status: true}),
            newsCategory.find({status: true}),
        ])
            .then(([menus,filmCategories,newsCategories]) => {
                menus = menus.map(menu => menu.toObject());
                filmCategories = filmCategories.map(filmCategory => filmCategory.toObject());
                newsCategories = newsCategories.map(newsCategory => newsCategory.toObject());

                filmCategories = filmCategories.map(curr => {
                    if(menus.some(item => item.name == curr.name)){
                         curr.selected = true;
                    }
                    else{
                        curr.selected = false;
                    }
                    return curr
                })

                newsCategories = newsCategories.map(curr => {
                    if(menus.some(item => item.name == curr.name)){
                         curr.selected = true;
                    }
                    else{
                        curr.selected = false;
                    }
                    return curr
                })

                res.render('admin/categories/index',{
                    layout: 'main2',
                    menus: handleShowCategories(menus),
                    filmCategories : handleShowCategories(filmCategories),
                    newsCategories : handleShowCategories(newsCategories),
                });
            })
            .catch(error => next(error));
    },
    update(req,res,next) {
        Menu.find({status: true})
            .then(menus =>{
                var [menu] = menus.filter(curr => curr._id == req.query.id);
                var maxIndex = menus.filter(curr => curr.parent_id == menu.parent_id);
                maxIndex = maxIndex.length;
                menu = menu.toObject();
                menus = menus.map(menu => menu.toObject());

                // Xử lý danh sách danh mục phim
                menus = handleUpdateCategories(menus,menu).map(curr => {
                    if(menu.parent_id == curr._id){
                        curr.selected = true;
                    }
                    else{
                        curr.selected = false;
                    }
                    return curr;
                })

                res.render('admin/categories/update',{
                    layout: 'main2',
                    menu,
                    menus,
                    maxIndex
                });
            })
            .catch(err => next(err));
    },
    delete(req,res,next) {
        Menu.find()
            .then((menus) =>{
                var [menu] = menus.filter(curr => curr._id == req.query.id);
                var index = menu.index;
                for(let i = index + 1; i<=menus.length ;i++){
                    Menu.updateOne({'index': i,parent_id: menu.parent_id},{'index': i - 1})
                        .then(menu => {
                        })
                        .catch(err => err.massage)
                }
            })
            .then(() =>{
                Menu.deleteOne({_id : req.query.id})
                    .then(() =>{
                    
                            res.cookie('message', 'Xóa thành công!',{ httpOnly: false ,encode: v => v});
                        res.redirect('/admin/menus');
                    })
                    .catch(err => next(err));
            })
            .catch(err => res.status(400).send(err.message));
    },
    handleCreate(req,res,next) {
        var result =[];
        var regex = /(\|---)+/;
        const menu = new Menu(req.body);
        var index = 0;
        console.log(req.body.info);
        Menu.find()
            .then((menus) => {
                var length =0;
                menus.map(curr => {
                    if(curr.parent_id == 0){
                        length ++;
                    }
                })
                return length; 
            })
            .then(length =>{
                if(req.body.info){
                    if(!Array.isArray(req.body.info)){
                        req.body.info = [req.body.info];
                    }
                    req.body.info.map(curr => {
                        length++;
                        curr = curr.split(',');
                        console.log(curr)
                        curr[0] = curr[0].replace(regex,'');
                        result.push({
                            slug : curr[1],
                            name: curr[0],
                            status: true,
                            parent_id: 0,
                            index:length,
                            module: curr[2]
                        })
                    
                    })
                }
                Menu.create(result)
                    .then(() =>{
                        res.redirect('/admin/menus');
                    })
                    .catch(err => res.status(400).send(err.message));
            })
            .catch(err => {
                res.status(400).send(err.message);
            })
        },
    handleUpdate(req,res,next) {
        Menu.find()
            .then((menus) => {
                var [menu] = menus.filter(curr => curr._id == req.query.id);
                var oldParentId = menu.parent_id;

                // biến đại diện cho mảng menu mục tiêu muốn chuyển đến trước khi update
                var oldMenusParentLength = menus.filter(curr => curr.parent_id == oldParentId);
                
                // biến đại diện cho mảng menu mục tiêu ban đầu trước khi update
                var oldMenusParentTargetLength = menus.filter(curr => curr.parent_id == req.body.parent_id);
                return {
                    oldParentId: oldParentId,
                    oldIndex: menu.index,
                    oldMenusParentLength: oldMenusParentLength.length,
                    parent_id: menu.parent_id,
                    oldMenusParentTargetLength: oldMenusParentTargetLength.length,
                }
            })
            .then((targetBeforeUpdate) =>{
                Menu.updateOne({_id : req.query.id},req.body)
                    .then(() =>{
                        Promise.all([Menu.find(),Menu.findById({_id: req.query.id})])
                            .then(([menus,menu]) =>{
                                var menusId0 = menus.filter(curr => curr.parent_id == 0 );
                                var index = menu.index;

                                // biến đại diện cho mảng menu mục tiêu muốn chuyển đến sau khi update
                                var newMenusParentTargetLength = menus.filter(curr => curr.parent_id == menu.parent_id);
                               
                                // biến đại diện cho mảng menu mục tiêu ban đầu sau khi update
                                var oldMenusParentLength = menus.filter(curr => curr.parent_id == targetBeforeUpdate.oldParentId);
                                var menusChild  = menus.filter(curr => {
                                    if(curr.parent_id == menu.parent_id && curr.parent_id != 0){
                                        return true;
                                    }
                                })

                                // TH: thay đổi vị trí menu từ cao tới vị trí thấp 
                                if(index < targetBeforeUpdate.oldIndex && targetBeforeUpdate.parent_id == menu.parent_id){
                                        for(let i = index ; i < menusChild.length ; i++){
                                            Menu.updateOne({'index': i ,"_id": {'$ne': menu._id},'parent_id' : menu.parent_id},{'index': i + 1})
                                                .then(menu => {
                                                })
                                                .catch(err => err.massage)
                                        }
                                }

                                // TH: thay đổi vị trí menu từ thấp tới vị trí cao 
                                if(index > targetBeforeUpdate.oldIndex && targetBeforeUpdate.parent_id == menu.parent_id){
                                    for(let i = targetBeforeUpdate.oldIndex + 1; i<= index ;i++){
                                        Menu.updateOne({'index': i  ,"_id": {'$ne': menu._id},parent_id : menu.parent_id},{'index': i - 1})
                                            .then(menu => {
                                            })
                                            .catch(err => err.massage)
                                    }
                                }

                                //TH: Tăng index các menu mới khi chuyển một menu vào menu cha
                                if(targetBeforeUpdate.oldMenusParentTargetLength < newMenusParentTargetLength.length){
                                    for(let i = index; i<newMenusParentTargetLength.length ;i++){
                                        Menu.updateOne({'index': i  ,"_id": {'$ne': menu._id},'parent_id' : menu.parent_id},{'index': i + 1})
                                            .then(menu => {
                                            })
                                            .catch(err => err.massage)
                                    }
                                }
                              
                                //TH: Giảm index danh sách menu cũ khi thay đổi parentId menu
                                if(targetBeforeUpdate.oldMenusParentLength > oldMenusParentLength.length){
                                    console.log(1)
                                    for(let i = targetBeforeUpdate.oldIndex + 1; i<= oldMenusParentLength.length + 1;i++){
                                        Menu.updateOne({'index': i ,"_id": {'$ne': menu._id},parent_id : targetBeforeUpdate.oldParentId},{'index': i - 1})
                                            .then(menu => {
                                            })
                                            .catch(err => err.massage)
                                    }
                                }
                                res.cookie('message', 'Cập nhật thành công!',{httpOnly: false})
                                res.redirect('/admin/menus');
                            })
                            .catch(err => res.status(400).send(err.message));
                    })
                    .catch(err => res.status(400).send(err.message));
            })
            .catch(err => res.status(400).send(err.message));
        }
  
}
module.exports = categoryItemController;