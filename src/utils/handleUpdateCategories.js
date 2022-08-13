const handleShowCategories = require('../utils/handleShowCategories')
module.exports = function(filmCategories,filmCategory){
    var result1 = [];
    var result2 =[];
    var all =[filmCategory];
      
        // tìm ra những danh mục con khi click vào danh mục cha
        while(all.length >0){
            all = filmCategories.filter(item => {
                if(all.some(one => item.parent_id == one._id)){
                    return true;
                }
                else{
                    return false;
                }
            })
            all.map(item => {
                result1.push(item);
            }); 
        }

        // loại bỏ danh mục con ra khỏi kết quả
        result1 = filmCategories.filter(item =>{
            if(result1.some(curr => curr._id === item._id) || item._id == filmCategory._id){
                return false
            }
            else{
                return true;
            }
        })
        result1.unshift({_id: 0,name: 'Trống',parent_id: 0})
        return handleShowCategories(result1)
}
