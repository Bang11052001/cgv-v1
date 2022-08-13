const express = require('express');
const { engine } =  require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const db = require('./config/db');
const route = require('./routes');
const methodOverride = require('method-override');
const middleware = require('./middleware/middleware');
const middlewareAuth = require('./middleware/middlewareAuth');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const room = require('./modules/room');
const cinemas = require('./modules/cinemas');
const showtime = require('./modules/showtime');
const { show } = require('./controller/categoryController');
const app = express();
var cookieParser = require('cookie-parser')
const port = 1000;
var passport = require('passport');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));
app.use(middleware);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'))
app.use(middlewareAuth);

//connect to mongodb
db.connect();



// Template engine
app.engine('.hbs',engine({
  extname: '.hbs',
  helpers:{
    HandleQualityId(obj){
      if(obj){
         var result = obj.map(item=>{
            return item._id._id
         })
         return result;
      }
    },
    subArrayRender(array){
     if(array){
        var result = array.map(item=>{
          if(item._id){
            return `<p>${item._id.name}</p>`
          }
          else
            return '';
        })
        return result.join('');
     }
    },
    subObjRender(obj){
      if(obj){
         var result = obj.name; 
         return result
      }
    },
    base64ImageSrc(imagePath){
      const bitmap = fs.readFileSync(path.join('src', 'public','uploads/' + imagePath));
      const base64String = new Buffer(bitmap).toString('base64');
      return new Handlebars.SafeString(`data:image/png;base64,${base64String}`);
    },
    statusHandle(status){
      if(status == 0){
        return status = "Disable";
      }
      else{
        return status = "Active";
      }
    },
    countRoom(id){
      var obj =  room.find({cinema_id : id});
      return obj;
    },
    handleSelectQuality(films){
      const formShowTime = document.querySelector('.select-showTime-create-film');
      formShowTime.onchange = function(event) {
        console.log(event.target.value);
      }
      console.log(films)
    },
    countIndex(a, b) {
      return a + b;
    },
    getNextChar(char) {
      return String.fromCharCode(char.charCodeAt(0) + 1);
    },
    countTotal(_this){
      console.log(_this.length)
      return _this.length
    },
    formatDate(date){
      var d = new Date(date);
      return d.toLocaleDateString('vi-VN');
    },
    formatTime(date){
      var d = new Date(date);
      return (d.toLocaleTimeString('vi-VN').slice(0,5));
    },
  }
}))
app.set('view engine', '.hbs');
app.set('views', path.join('src', 'resources', 'views'));

route(app);

app.post('/upload',multipartMiddleware,(req,res)=>{
  try {
      fs.readFile(req.files.upload.path, function (err, data) {
          var newPath = __dirname + '/public/img/uploads' + req.files.upload.name;
          fs.writeFile(newPath, data, function (err) {
              if (err) console.log({err: err});
              else {
              //     imgl = '/images/req.files.upload.originalFilename';
              //     let img = "<script>window.parent.CKEDITOR.tools.callFunction('','"+imgl+"','ok');</script>";
              //    res.status(201).send(img);
               
                  let fileName = req.files.upload.name;
                  let url = '/img/uploads'+fileName;                    
                  let msg = 'Upload successfully';
                  let funcNum = req.query.CKEditorFuncNum;
                  console.log({url,msg,funcNum});
                 
                  res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('"+funcNum+"','"+url+"','"+msg+"');</script>");
              }
          });
      });
     } catch (error) {
         console.log(error.message);
     }
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})