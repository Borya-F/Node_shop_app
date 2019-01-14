const Product = require('../models/product.js');
const User = require('../models/user.js');
const msg = require('../util/messagelog.js');
 

const code_loc = 'shop_controller';

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
        msg.err(err);
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
        msg.err(err);
    });
};

exports.getCart = (req, res, next) => {


    req.user.getCart()
    .then(cartItems=>{
        msg.test(cartItems)
        res.render('shop/cart',{
            pageTitle: 'cart',
            activeNav: 'cart',
            prods: cartItems
        });
    })
    .catch(err=>{
        msg.err(err);
    })
};

// exports.postCartDelItem = (req, res, next) => {

//     const itemId = req.body.prodId;
    
//     let fetchedCart;

//     req.user.getCart()
//     .then(cart=>{
//         fetchedCart = cart;
//         return fetchedCart.getProducts({
//             where:{id: itemId}
//         });
//     })
//     .then(products=>{
//         let product = products[0];
//         return product.cartItem.destroy();
//     })
//     .then(()=>{
//         res.redirect('/cart');
//     })
//     .catch(err=>{
//         console.log(chalk.red(err));
//     })    
// }

exports.postAddToCart = (req, res, next) => {
    const itemToAddId = req.body.productId;

    req.user.addToCart(itemToAddId)
    .then(result=>{
        msg.success(result,'admin_controller.js');
    })
    .catch(err=>{
        msg.err(err);
    })

    res.redirect('/home');
}

// exports.getOrder = (req,res,next) =>{

//     req.user.getOrders({
//         include: ['products']
//     })
//     .then(orders=>{
//         res.render('shop/orders',{
//             pageTitle: 'orders',
//             activeNav: 'orders',
//             orders: orders
//         })
//     })
//     .catch(err=>{
//         console.log(chalk.red(err));
//     });
    
// };

// exports.postAddToOrder = (req,res,next)=>{

//     let fetchedCart;

//     req.user.getCart()
//     .then(cart=>{
//         fetchedCart = cart;
//         return cart.getProducts();
//     })
//     .then(cartProducts=>{
//         return req.user.createOrder({
//             id: gen_id.generate_hex_id()
//         })
//         .then(order=>{
//             return order.addProducts(cartProducts.map(product=>{
//                 product.orderItem = {
//                     id: gen_id.generate_hex_id(),
//                     quantity: product.cartItem.quantity
//                 };
//                 return product;
//             }));
//         })
//         .catch(err=>{
//             console.log(chalk.red(err));
//         })
//     })
//     .then(result=>{
//         return fetchedCart.setProducts(null);
        
//     })
//     .then(result=>{
//         res.redirect('/orders');
//     })
//     .catch(err=>{
//         console.log(chalk.red(err));
//     })
    
// };



