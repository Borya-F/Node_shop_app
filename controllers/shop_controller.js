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

    Product.fetchProductById(prodId)
    .then(([rows,fieldData])=>{
        console.log('el retrieved', rows[0]);
        res.render('shop/product_detail',{
            pageTitle: rows[0].title,
            product: rows[0]
        });
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.getCart = (req, res, next) => {

    let cartToSend;

    Cart.fetchCartFileContent()
        .then(cart => {
            cartToSend = { ...cart };
            return Product.fetchAllProducts();
        })
        .then(products => {

            const currentItems = cartToSend.cartProducts.map(el => el.itemId);
            let prodsArray = products.filter(prod => currentItems.includes(prod.id));
            prodsArray = prodsArray.map(prod => {
     
                let item = cartToSend.cartProducts.find(el => el.itemId === prod.id);
                let itemToReturn = { ...prod, qty: item.qty };

                return itemToReturn;
            });

            res.render('shop/cart', {
                pageTitle: "cart",
                activeNav: "cart",
                price: cartToSend.totalPrice,
                prods: prodsArray
            })
        })
        .catch(err => {
            throw err;
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