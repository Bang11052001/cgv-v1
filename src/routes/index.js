const siteRoutes = require('./site.js');
const categoryRoutes = require('./category.js');
const adminRoutes = require('./admin.js');
const apiRoutes = require('./api.js');

function routes(app){
  app.use('/',siteRoutes);  
  app.use('/category',categoryRoutes); 
  app.use('/admin',adminRoutes);   
  app.use('/ajax',apiRoutes);   
}

module.exports = routes;