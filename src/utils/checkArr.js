module.exports = function(target){
    if(!Array.isArray(target)){
        return target = [target];
    }
    else{
        return target
    }
}