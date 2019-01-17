const Product = require('../models/product.js');
const User = require('../models/user.js');
const Order = require('../models/order.js');
const msg = require('../util/messagelog.js');
 


exports.getHome = (req, res, next) => {

    Product.find()
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

    Product.findById(prodId)
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

    req.user.populate('cart.items.productId')
    .execPopulate()
    .then(user=>{

        res.render('shop/cart',{
            pageTitle: 'cart',
            activeNav: 'cart',
            prods: user.cart.items
        })
    })
    .catch(err=>{
        msg.err(err,'shpo_cntrl');
    });
};

exports.postCartDelItem = (req, res, next) => {

    const itemId = req.body.prodId;
    
    req.user.deleteItemFromCart(itemId)
    .then(result=>{
        msg.success('successfully deleted item from cart','shop_cntrl');
        res.redirect('/cart');
    })
    .catch(err=>{
        msg.err(err,'shop_cntrl');
    });
};

exports.postAddToCart = (req, res, next) => {
    const itemToAdd = req.body.productId;

    req.user.addToCart(itemToAdd)
    .then(result=>{
        msg.success('added item to cart successfully','shop_cntrl');
        res.redirect('/home');
    })
    .catch(err=>{
        msg.err(err,'shop_cntrl');
    });
};

exports.getOrder = (req,res,next) => {

    Order.find({
        userId: req.user._id
    })
    .populate('products.productData')
    .exec()
    .then(result=>{

        msg.test(result,'shop_controller.js');
        res.render('shop/orders',{
            pageTitle: 'orders',
            activeNav: 'orders',
            orders: result
        })
    })
    .catch(err=>{
        msg.err(err,'shop_controller.js');
    })
};

exports.postAddToOrder = (req,res,next)=>{

    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user=>{

        const products = user.cart.items.map(i=>{
            return {
                productData: i.productId,
                qty: i.qty
            }
        });

        const orderToAdd = new Order({
            userId: req.user._id,
            products: products

        });

        return orderToAdd.save();

    })
    .then(result=>{
        return req.user.clearCart();
    })
    .then(result=>{
        res.redirect('/orders');
    })
    .catch(err=>{
        msg.err(err);
    });

};



