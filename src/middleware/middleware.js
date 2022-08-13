const menu = require('../modules/menu')

module.exports = function(req,res,next){
    menu.find()
        .then(menus =>{
            menus = menus.map(menu => menu.toObject());
            var menusParentId0 = menus.filter(menu => menu.parent_id == 0);

            menusParentId0.map(curr => {
                var subMenu = menus.filter(item => item.parent_id == curr._id);
                curr.sub_menu = subMenu;
            })
            res.locals.menu = menusParentId0;
            next();
        })
}