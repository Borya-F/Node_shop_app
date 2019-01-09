const Product = require('../models/product.js');
const Cart = require('../models/cart.js');
const id_gen = require('../util/id_generator.js');
const chalk = require('chalk');


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

    req.user.createProduct({
        id: id_gen.generate_prodcut_id(),
        title: title,
        price: price,
        desc: desc,
        imgURL: "https://picsum.photos/150/150/?random",
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

    req.user.getProducts({
        where: {id: productId}
    })
    .then(result=>{
        const product = result[0];
        res.render('admin/edit_product', {
            product: product
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

    Product.findByPk(productId)
    .then(product=>{
        return product.update({
            title: prodChanges.title,
            price: prodChanges.price,
            desc: prodChanges.desc,
            imgURL: prodChanges.imgURL
        },{fields:['title','price','desc','imgURL']});
    })
    .then(()=>{
        console.log(chalk.yellow(`don't forget to update cart`));
        res.redirect('/admin/products');
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.params.id;

    Product.findByPk(productId)
    .then(product=>{
        return product.destroy();
    })
    .then(()=>{
        console.log(chalk.yellow(`don't forget to update cart`));
        res.redirect('/admin/products');
    })
    .catch(err=>{
        console.log(err);
    })
    
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