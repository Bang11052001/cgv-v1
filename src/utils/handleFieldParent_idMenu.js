module.exports = function(all,objSeleted){
    console.log(objSeleted.parent_id)
    if(objSeleted){
        return all.map(curr => {
            if(objSeleted.parent_id == curr._id){
                curr.checked = true;
            }
            else{
                curr.checked = false;
            }
            return curr;
        })
    }
    else{
        return all.map(curr => {
            curr.checked = false;
            return curr;
        })
    }
}