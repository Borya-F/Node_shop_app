const Product = require('../models/product.js');
const Cart = require('../models/cart.js');
const crypto = require("crypto");


exports.getAddProduct = (req, res, next) => {

    res.render('admin/edit_product', {
        pageTitle: "add-product",
        activeNav: 'add-product'
    });
};

exports.postAddProduct = (req, res, next) => {

    const title = req.body.title;
    const price = req.body.price;
    const imgUrl = req.body.imgURL;
    const desc = req.body.desc;

    Product.create({
        id: crypto.randomBytes(8).toString("hex"),
        title: title,
        price: price,
        desc: desc,
        imgURL: "https://picsum.photos/150/150/?random"
    })
    .then(result=>{
        res.redirect('/admin/products');
    })
    .catch(err=>{
        console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.id;

    Product.findByPk(productId)
    .then(result=>{
        res.render('admin/edit_product', {
            product: result
        });
    })
    .catch(err=>{
        console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
    const productId = req.params.id;

    const prodChanges = {
        title: req.body.title,
        price: req.body.price,
        desc: req.body.desc,
        imgURL: req.body.imgURL
    }


    Product.updateProduct(productId, prodChanges)
    .then(result=>{
        console.log(result);
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.params.id;

    let productPrice;

    Product.deleteProductById(productId)
        .then(prodPrice => {
            productPrice = prodPrice;
            return Cart.fetchCartFileContent();
        })
        .then(cart=>{

            const cartItemIds = cart.cartProducts.map(item=>item.itemId);
            if(cartItemIds.includes(productId)) return Cart.removeProductFromCart(productId,productPrice);
            
        })
        .then(()=>{
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProducts = (req, res, next) => {
    Product.findAll({
        order: [
            ['createdAt', 'DESC']
        ]
    })
    .then(products=>{
        res.render('admin/admin_products', {
            pageTitle: "admin products",
            activeNav: 'admin-products',
            prods: products
        })
    })
    .catch(err=>{
        console.log(err);
    });
}