const siteRoutes = require('./site.js');
const categoryRoutes = require('./category.js');
const adminRoutes = require('./admin.js');

function routes(app){
  app.use('/',siteRoutes);  
  app.use('/category',categoryRoutes); 
  app.use('/admin',adminRoutes);   
}

module.exports = routes;