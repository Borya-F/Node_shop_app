const Product = require('../models/product.js');
const User = require('../models/user.js');
const msg = require('../util/messagelog.js');
 


exports.getHome = (req, res, next) => {

    Product.fetchAll()
    .then(products=>{
        res.render('shop/shop',{
            pageTitle: 'Home',
            activeNav: 'home',
            prods: products
        })
    })
    .catch(err=>{
        msg.err(err,'shop_cntrl');
    });
};

exports.getProductDetail = (req, res, next) => {

    const prodId = req.params.id;

    Product.fetchProductById(prodId)
    .then(fetchedProd=>{
        res.render('shop/product_detail',{
            pageTitle: fetchedProd.title,
            product: fetchedProd
        });
    })
    .catch(err=>{
        msg.err(err,'shop_cntrl');
    });
};

exports.getCart = (req, res, next) => {


    req.user.getCart()
    .then(cartItems=>{
        res.render('shop/cart',{
            pageTitle: 'cart',
            activeNav: 'cart',
            prods: cartItems
        });
    })
    .catch(err=>{
        msg.err(err,'shop_cntrl');
    })
};

exports.postCartDelItem = (req, res, next) => {

    const itemId = req.body.prodId;
    
    let fetchedCart;

    req.user.deleteItemFromCart(itemId)
    .then(result=>{
        msg.success(result,'shop_cntrl');
        res.redirect('/cart');
    })
    .catch(err=>{
        msg.err(err,'shop_cntrl');
    })
  
}

exports.postAddToCart = (req, res, next) => {
    const itemToAddId = req.body.productId;

    req.user.addToCart(itemToAddId)
    .then(result=>{
        msg.success(result,'shop_cntrl');
        res.redirect('/home');
    })
    .catch(err=>{
        msg.err(err,'shop_cntrl');
    });
};

exports.getOrder = (req,res,next) => {

    req.user.getOrders()
    .then(orders=>{
        res.render('shop/orders',{
            pageTitle: 'ordersPage',
            activeNav: 'orders',
            orders: orders
        })
    })
    .catch(err=>{
        msg.err(err,'shop_cntrl');
    })
};

exports.postAddToOrder = (req,res,next)=>{

    req.user.addOrder()
    .then(result=>{
        msg.status(result,'shop_cntrl');
        res.redirect('/orders');
    })
    .catch(err=>{
        msg.err(err,'shop_cntrl');
    })
    
};



