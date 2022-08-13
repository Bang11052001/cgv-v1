module.exports = function(arr,seleted){
    if(seleted.length > 0){
        return arr.map(curr => {
            if(seleted.some(item => item._id == curr._id)){
                curr.checked = true;
            }
            else{
                curr.checked = false;
            }
            return curr;
        })
    }
    else{
        return arr.map(curr => {
            curr.checked = false;
            return curr;
        })
    }
}