//node modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

//debug
const chalk = require('chalk');

//db connection
const db = require('./util/database.js');

//helper functions
const id_gen = require('./util/id_generator.js');

//routes/controllers
const shopRoutes = require('./routes/shop_routes.js');
const adminRoutes = require('./routes/admin_routes.js');
const sharedController = require('./controllers/sharedController.js');

//models
const Product = require('./models/product.js');
const User = require('./models/user.js');
const Cart = require('./models/cart.js');
const CartItem = require('./models/cart-item.js');


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

//setting up mock user
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

//Routes instantiation
app.use(shopRoutes);
app.use('/admin',adminRoutes);
app.use(sharedController.get404);


//Schema Associations
Product.belongsTo(User,{
	constraints: true,
	onDelete: 'CASCADE'
	// foreignKey: {
	// 	allowNull: false
	// }
});

User.hasMany(Product); //optional
User.hasOne(Cart);
Cart.belongsTo(User); //optional

//many to many - creates an intermediary table Cart:Product
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});




db.sync({force:true})
// db.sync()
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








