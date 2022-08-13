const jwt = require('jsonwebtoken');

module.exports = function(req,res,next){
    if(req.cookies.token){
        var user = jwt.verify(req.cookies.token,'mk')
        res.locals.user = user;
    }
    next();
}