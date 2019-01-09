const chalk = require('chalk');

const Product = require('../models/product.js');
const Cart = require('../models/cart.js');

exports.getHome = (req, res, next) => {

    Product.findAll({
        order: [
            ["createdAt", "DESC"]
        ]
    })
    .then(products=>{
        res.render('shop/shop',{
            acticeNav: "home",
            pageTitle: "shop",
            prods: products
        });
    })
    .catch(err=>{
        console.log(err);
    })
};

exports.getProductDetail = (req, res, next) => {

    const prodId = req.params.id;

    Product.findByPk(prodId)
    .then(product=>{
        res.render('shop/product_detail',{
            pageTitle: product.title,
            product: product
        });
    })
    .catch(err=>{
        console.log(err);
    });
};

exports.getCart = (req, res, next) => {

    req.user.getCart()
    .then(cart=>{
        return cart.getProducts();
    })
    .then(products=>{
        res.render('shop/cart',{
            pageTitle: Cart,
            prods: products,
            activeNav: 'cart'
        })
    })
    .catch(err=>{
        console.log(chalk.red(err));
    });
};

exports.postCartDelItem = (req, res, next) => {

    const itemId = req.body.prodId;
    const itemPrice = req.body.prodPrice;

    Cart.removeProductFromCart(itemId,itemPrice)
    .then(msg=>{
    	res.redirect('/cart');
    })
    .catch(err=>{
    	console.log(err);
    })


    
}

exports.postAddToCart = (req, res, next) => {
    const itemToAdd = req.body.productId;
    const itemPrice = req.body.productPrice;

    Cart.addItemToCart(itemToAdd, itemPrice)
        .then(msg => {
            console.log(msg);
            return res.redirect('/home');
        })
        .catch(err => {
            console.log(err);
        });
};