const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const shopRoutes = require('./routes/shop_routes.js');
const adminRoutes = require('./routes/admin_routes.js');
const sharedController = require('./controllers/sharedController.js');
const sequelize = require('./util/database.js');


const dev_port = 3000;
const app = express();



//global configurations
app.set('view engine', 'pug');	//view engine as pug
app.set('views', 'views');

//body-parser
app.use(bodyParser.urlencoded({
	extended: false
}));

//path to static files
app.use(express.static(path.join(__dirname, 'public')));


//Routes
app.use(shopRoutes);
app.use('/admin',adminRoutes);

app.use(sharedController.get404);

sequelize.sync()
.then(result=>{
	app.listen(dev_port);
})
.catch(err=>{
	console.log()
})


console.log('Server is running on port 3000');





