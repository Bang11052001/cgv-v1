const jwt = require('jsonwebtoken');

// Middleware yêu cầu đăng nhập
module.exports = function Private(req,res,next){
  try{
    var user = jwt.verify(req.cookies.token,'mk')
    if(user){
      next();
    }
  }
  catch(err){
    res.redirect('/login');
  }
}