const express = require('express');
const shopController = require('../controllers/shop_controller.js');

const router = express.Router();


router.get('/', shopController.getHome);
router.get('/shop',shopController.getHome);
router.get('/home', shopController.getHome);
router.get('/index', shopController.getHome);
router.get('/products',shopController.getHome);
router.get('/products/:id',shopController.getProductDetail);
// router.get('/cart',shopController.getCart);
// router.post('/cart', shopController.postAddToCart);
// router.post('/cartDeleteItem',shopController.postCartDelItem);
// router.get('/orders',shopController.getOrder);
// router.post('/orders',shopController.postAddToOrder);






module.exports = router;