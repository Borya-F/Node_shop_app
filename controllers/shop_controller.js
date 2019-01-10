const chalk = require('chalk');
const util = require('util');
const gen_id = require('../util/id_generator.js');
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
            pageTitle: 'Cart',
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
    
    let fetchedCart;

    req.user.getCart()
    .then(cart=>{
        fetchedCart = cart;
        return fetchedCart.getProducts({
            where:{id: itemId}
        });
    })
    .then(products=>{
        let product = products[0];
        return product.cartItem.destroy();
    })
    .then(()=>{
        res.redirect('/cart');
    })
    .catch(err=>{
        console.log(chalk.red(err));
    })


    
}

exports.postAddToCart = (req, res, next) => {

    const itemToAdd = req.body.productId;

    let fetchedCart;

    req.user.getCart()
    .then(cart=>{
        fetchedCart = cart;
        return cart.getProducts({
            where: {id: itemToAdd}
        })
    })
    .then(products=>{
        let product;
        if(products.length > 0){
           product = products[0];
        }
        let newQuantity = 1;
        if(product){
            let oldQty = product.cartItem.quantity;
            newQuantity = ++oldQty;
            return fetchedCart.addProduct(product,{
                through: {quantity: newQuantity}
            });
        }else{
            return Product.findByPk(itemToAdd)
            .then(product=>{
                return fetchedCart.addProduct(product,{
                    through: {
                        id: gen_id.generate_hex_id(),
                        quantity: newQuantity
                    }
                })
            })
            .catch(err=>{
                console.log(chalk.red(err));
            });
        }

    })
    .then(()=>{
        res.redirect('/');
    })
    .catch(err=>{
        console.log(chalk.red(err));
    })
};