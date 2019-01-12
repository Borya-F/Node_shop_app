const Product = require('../models/product.js');
const Cart = require('../models/cart.js');
const msg = require('../util/messagelog.js');

//logging
const code_loc = 'admin_controller';

exports.getProducts = (req, res, next) => {

    Product.fetchAll()
    .then(products=>{
        res.render('admin/admin_products',{
            pageTitle: 'adminProducts',
            activeNav: 'admin-products',
            prods: products
        })
    })
    .catch(err=>{
        msg.err(err);
    })
}


exports.getAddProduct = (req, res, next) => {


    res.render('admin/edit_product', {
        pageTitle: "add-product",
        activeNav: 'add-product'
    });
};

exports.postAddProduct = (req, res, next) => {

    const userId = req.user._id;
    const title = req.body.title;
    const price = req.body.price;
    const desc = req.body.desc;
    let imgUrl = req.body.imgURL;

    try {
    	const prod = new Product(userId,title,+price,desc,imgUrl= "https://picsum.photos/150/150/?random");
	    prod.save()
	    .then(result=>{
	    	msg.success('new product added',code_loc);
            res.redirect('/admin/products');
	    })
	    .catch(err=>{
	    	msg.err(err,code_loc);
	    })
    } catch(e) {
    	msg.err(e,code_loc);
    }
};

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.params.id;

    try {
        Product.deleteProductById(productId)
        .then(result=>{
            msg.success('product successfully deleted', code_loc);
            res.redirect('/admin/products');
        })
        .catch(err=>{
            msg.err(err);
        })
    } catch(e) {
         msg.err(e,code_loc);
    }
    
    
};

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.id;

    try {
        Product.fetchProductById(productId)
        .then(product=>{
            res.render('admin/edit_product',{
                pageTitle: 'edit product',
                product: product
            })
        })
    } catch(e) {
        msg.err(e,code_loc);
    }
};

exports.postEditProduct = (req, res, next) => {
    const productId = req.params.id;

    const prodChanges = {
        title: req.body.title,
        price: req.body.price,
        desc: req.body.desc,
        imgUrl: req.body.imgURL
    }

    try {
         Product.updateProductById(productId,prodChanges)
        .then(result=>{
            msg.success('updated product successfully',code_loc);
            res.redirect('/admin/products');
        })
        .catch(err=>{
            msg.err(err,code_loc);
        })
    } catch(e) {
        msg.err(e,code_loc);
    }
}



