const siteRoutes = require('./site');
const movieCategoryRoutes = require('./movieCategory');
const adminRoutes = require('./admin');
const apiRoutes = require('./api');

function routes(app){
  app.use('/',siteRoutes);  
  app.use('/danh-muc-phim',movieCategoryRoutes); 
  app.use('/booking-ticket',movieCategoryRoutes); 
  app.use('/admin',adminRoutes);   
  app.use('/api',apiRoutes);   
}

module.exports = routes;