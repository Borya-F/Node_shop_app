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

// exports.getCart = (req, res, next) => {

//     req.user.getCart()
//     .then(cart=>{
//         return cart.getProducts();
//     })
//     .then(products=>{
//         res.render('shop/cart',{
//             pageTitle: 'Cart',
//             prods: products,
//             activeNav: 'cart'
//         })
//     })
//     .catch(err=>{
//         console.log(chalk.red(err));
//     });
// };

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
    const itemToAdd = req.body.product;

    msg.status(`item to add ${itemToAdd}`);

    // User.fetchUserById(req.user._id)
    // .then(user=>{
    //     msg.test(typeof user);
    //     return user.addToCart(itemToAdd_id);
    // })
    // .then(result=>{
    //     msg.success(result);
    // })
    // .catch(err=>{
    //     msg.err(err);
    // })


    res.redirect('/home');
}

//     const itemToAdd = req.body.productId;

//     let fetchedCart;

//     req.user.getCart()
//     .then(cart=>{
//         fetchedCart = cart;
//         return cart.getProducts({
//             where: {id: itemToAdd}
//         })
//     })
//     .then(products=>{
//         let product;
//         if(products.length > 0){
//            product = products[0];
//         }
//         let newQuantity = 1;
//         if(product){
//             let oldQty = product.cartItem.quantity;
//             newQuantity = ++oldQty;
//             return fetchedCart.addProduct(product,{
//                 through: {quantity: newQuantity}
//             });
//         }else{
//             return Product.findByPk(itemToAdd)
//             .then(product=>{
//                 return fetchedCart.addProduct(product,{
//                     through: {
//                         id: gen_id.generate_hex_id(),
//                         quantity: newQuantity
//                     }
//                 })
//             })
//             .catch(err=>{
//                 console.log(chalk.red(err));
//             });
//         }

//     })
//     .then(()=>{
//         res.redirect('/');
//     })
//     .catch(err=>{
//         console.log(chalk.red(err));
//     })
// };

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



