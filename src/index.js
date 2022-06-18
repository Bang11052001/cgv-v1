const express = require('express');
const { engine } =  require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const db = require('./config/db');
const route = require('./routes');
const methodOverride = require('method-override');
const middleware = require('./middleware/middleware');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const room = require('./modules/room');
const cinemas = require('./modules/cinemas');
const showtime = require('./modules/showtime');
const { show } = require('./controller/categoryController');
const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, 'public')));

app.use(middleware);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//connect to mongodb
db.connect();

// app.use(methodOverride('_method'));
app.use(methodOverride('_method'))


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
    subArrayDocumentRender(obj){
     if(obj){
        var result = obj.map(item=>{
          if(item._id){
            console.log(obj)
            return item._id.name
          }
          else
            return '';
        })
        return result;
     }
    },
    subObjDocumentRender(obj){
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
  
    // lap(showTimes){
    //   var html ;
    //   var check = [];
    //     Array.from(showTimes).map(curr=>{
    //       if(!check.includes(curr.cinema_id.area.name)){
    //         check.push(curr.cinema_id.area.name);
    //       }
    //     })
    //     var result = check.map(((curr,index)=>{
    //       return html =  `
    //       <input type="radio" id='site${index}' name="site" value='${curr}'>
    //       <label class ='booking-ticket-site-label col col-lg-1 booking-ticket-site-label' for="site${index}">${curr}</label>
    //     `;
    //     }))
    //     result = result.join('');
    //     return result;
    // }
  }
}))
app.set('view engine', '.hbs');
app.set('views', path.join('src', 'resources', 'views'));

route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})