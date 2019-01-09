const express = require('express');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const path = require('path');
const shopRoutes = require('./routes/shop_routes.js');
const adminRoutes = require('./routes/admin_routes.js');
const sharedController = require('./controllers/sharedController.js');
const db = require('./util/database.js');
const Product = require('./models/product.js');
const User = require('./models/user.js');
const id_gen = require('./util/id_generator.js');



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


app.use((req,res,next)=>{
	User.findByPk('b2a16684')
	.then(user=>{
		req.user = user;
		next();
	})
	.catch(err=>{
		console.log(err);
	});
});



//Routes
app.use(shopRoutes);
app.use('/admin',adminRoutes);

app.use(sharedController.get404);





Product.belongsTo(User,{
	constraints: true,
	onDelete: 'CASCADE'
	// foreignKey: {
	// 	allowNull: false
	// }
});

User.hasMany(Product);


db.sync()
.then(result=>{
	return User.findByPk('b2a16684');
})
.then(user=>{
	if(!user){
		return  User.create({
        id: id_gen.generate_user_id(),
        name: "Borya Fishman",
        email: "dummy-email@gmail.com"
    	});
	}else{
		return user;
	}
})
.then(user=>{
	console.log(chalk.yellow('Server is running on port 3000'));
	app.listen(dev_port);
})
.catch(err=>{
	console.log(chalk.red(err));
});








