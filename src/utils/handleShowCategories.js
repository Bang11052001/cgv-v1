module.exports = function(_this,second){
    var dashArr = [];
    var result = [];
    var restArr = [];
    var stack =[];
    var index = 0;
    var sum=0

    // thêm trường total 
    if(second){
        _this.map(curr => {
            sum = second.reduce((total,num) => {
                num.category.map(item => {
                    if(item._id == curr._id){
                        total++;
                    }
                })
                return total;
            },0)
            curr.total = sum;
        })
    }

    // Tạo gạch ở đầu danh mục
    _this.map(item =>{
        if(item.parent_id == 0){
            dashArr.push(item);
        }
        else{
            var dem = 0;
            var target = item;
            while(target.parent_id != 0){
                target = _this.find(curr => curr._id == target.parent_id);
                dem++;
            }
            for(let i=0;i<dem;i++){
                item.name = `|---` + item.name;
            }
            dashArr.push(item)
        }
    });

    //push vào result menu có parent_id = 0
    dashArr.map(curr => {
        if(curr.parent_id == 0){
            result.push(curr)
        }  
    })

    if(result.length > 0){
        if(result[0].index){
            result.sort((a,b) => {
                return a.index - b.index;
            })
        }
    }

    // Mảng còn lại không chứ parentId 
    restArr = dashArr.filter(curr =>{
        if(result.some(item => item._id == curr._id)){
            return false;
        }
        else{
            return true;
        }
    });

    // Tìm trong restArr những menu là con của menu trong result nếu không thấy cho  vào stack
    restArr.map(curr => {
        index = result.findIndex(filmCategory => filmCategory._id == curr.parent_id);
        if(index >= 0){
            var a1 = result.filter(item => item.parent_id == curr.parent_id);
            var dem =0;
            a1.map(curr1 => {
                var childMenu = result.filter(item => item.parent_id == curr1._id);
                dem +=childMenu.length;
            })
            result.splice(index + dem + a1.length +  1, 0 , curr)
        }
        else{
            stack.push(curr);
        }
    })


    result.sort((a,b) => {
            if(a.parent_id == b.parent_id){
                return a.index - b.index;
            }
        })

    // Thêm menu con vào sau menu cha
    while(stack.length >0){
        
    // stack.sort((a,b) => {
    //     if(a.parent_id == b.parent_id){
    //         return a.index - b.index;
    //     }
    // })
        stack.map((curr,index) => {
            var index1 = result.findIndex(item => item._id == curr.parent_id);
            var dem =0;
            if(index1 >= 0){
                var a1 = result.filter(item => item.parent_id == curr.parent_id);
                a1.map(curr1 => {
                    var childMenu = result.filter(item => item.parent_id == curr1._id);
                    dem +=childMenu.length;
                })
                    result.splice(index1 + dem + a1.length +  1, 0 , curr)
                    stack.splice(index,1);
            }
        })
    }

    result.sort((a,b) => {
        if(a.parent_id == b.parent_id){
            return a.index - b.index;
        }
    })

    
    return result;
}
