const Product = require('../models/product.js');
const msg = require('../util/messagelog.js');



exports.getProducts = (req, res, next) => {

    Product.find()
    .then(products=>{
        res.render('admin/admin_products',{
            pageTitle: 'adminProducts',
            activeNav: 'admin-products',
            prods: products
        })
    })
    .catch(err=>{
        msg.err(err,'adm_cntrl');
    })
}


exports.getAddProduct = (req, res, next) => {


    res.render('admin/edit_product', {
        pageTitle: "add-product",
        activeNav: 'add-product'
    });
};

exports.postAddProduct = (req, res, next) => {

    // const userId = req.user._id;
    const title = req.body.title;
    const price = req.body.price;
    const desc = req.body.desc;
    const imgUrl = req.body.imgURL;

    try {
    	const prod = new Product({
    		title: title,
    		price: price,
    		desc: desc,
    		imgUrl: "https://picsum.photos/150/150/?random"
    	})
	    prod.save()
	    .then(result=>{
	    	msg.success('new product added','adm_cntrl');
            res.redirect('/admin/products');
	    })
	    .catch(err=>{
	    	msg.err(err,'adm_cntrl');
	    })
    } catch(e) {
    	msg.err(e,'adm_cntrl');
    }
};

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.params.id;

    Product.findById(productId)
    .then(product=>{
        return product.remove();
    })
    .then(result=>{
        msg.success('product successfully removed','adm_cntrl');
        res.redirect('/admin/products');
    })
    .catch(err=>{
        msg.err(err,'adm_cntrl');
    });
    
    
};

exports.getEditProduct = (req, res, next) => {
    const productId = req.params.id;

 
    Product.findById(productId)
    .then(product=>{
        res.render('admin/edit_product',{
            pageTitle: 'edit product',
            product: product
        })
    })
    .catch(err=>{
        msg.err(err,'adm_contrl');
    });
    
};

exports.postEditProduct = (req, res, next) => {
    const productId = req.params.id;

    const prodChanges = {
        title: req.body.title,
        price: req.body.price,
        desc: req.body.desc,
        imgUrl: req.body.imgURL
    }

    Product.findById(productId)
    .then(product=>{
        product.title = prodChanges.title;
        product.price = prodChanges.price;
        product.desc = prodChanges.desc;
        product.imgUrl = prodChanges.imgUrl;
        product.updated = new Date();

        return product.save();
    })
    .then(result=>{
        msg.success('product successfully updated','adm_cnrl');
        res.redirect('/admin/products');
    })
    .catch(err=>{
        msg.err(err,'adm_cntrl')
    });
};



