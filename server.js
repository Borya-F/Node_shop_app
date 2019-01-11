//node modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

//debug
const chalk = require('chalk');

//db connection
const db = require('./util/database.js');

//helper functions
const msg = require('./util/messagelog.js');

//routes/controllers
const shopRoutes = require('./routes/shop_routes.js');
const adminRoutes = require('./routes/admin_routes.js');
const sharedController = require('./controllers/sharedController.js');


// parameters
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



//Routes instantiation
app.use(shopRoutes);
app.use('/admin',adminRoutes);
app.use(sharedController.get404);


// db()
// .then(client=>{
// 	console.log(chalk.green(client));
// 	console.log(chalk.yellow('Server is running on port 3000'));
// 	app.listen(dev_port);
// })

db.mongoConnect()
.then(client=>{

	// console.log(chalk.green(client));
	app.listen(dev_port);
	
	// client.close();
})
.catch(err=>{
	console.log(chalk.red(err));
})




