const Product = require('../models/product.js');
const Cart = require('../models/cart.js');

exports.getHome = (req,res,next) => {
	
	Product.fetchAllProducts()
	.then(products=>{
		res.render('shop/shop',{
			activeNav: "home",
			pageTitle: "home",
			prods: products
		});
	})
	.catch(err=>{
		throw err;
	});
};

exports.getProductDetail = (req,res,next) => {

	const prodId = req.params.id;

	Product.fetchProductById(prodId)
	.then(prod=>{
		res.render('shop/product_detail',{
			pageTitle: prod.title,
			product: prod
		});
	});
}

exports.getCart = (req,res,next) => {

	let cartToSend;

	Cart.fetchCartFileContent()
	.then(cart=>{
		cartToSend = {...cart};
		return Product.fetchAllProducts();
	})
	.then(products=>{

		const currentItems = cartToSend.cartProducts.map(el=>el.itemId);
		let prodsArray = products.filter(prod=>currentItems.includes(prod.id));
		prodsArray = prodsArray.map(prod=>{
			//find item in cartToSend with the same id as prod
			//attach qty from that item to prodsArray.
			
			let item = cartToSend.cartProducts.find(el=>el.itemId === prod.id);
			let itemToReturn = {...prod, qty:item.qty};
			
			return itemToReturn;
		});

		res.render('shop/cart',{
			pageTitle: "cart",
			activeNav: "cart",
			price: cartToSend.totalPrice,
			prods: prodsArray
		})
	})
	.catch(err=>{
		throw err;
	});
};

exports.postAddToCart = (req,res,next) => {
	const itemToAdd = req.body.productId;
	const itemPrice = req.body.productPrice;

	Cart.addItemToCart(itemToAdd,itemPrice)
	.then(msg=>{
		console.log(msg);
		return res.redirect('/home');
	})
	.catch(err=>{
		console.log(err);
	});
};










