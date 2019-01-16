const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin_controller.js');

router.get('/add-product', adminController.getAddProduct);
router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:id', adminController.getEditProduct);
router.post('/edit-product/:id', adminController.postEditProduct);

router.post('/delete-product/:id', adminController.postDeleteProduct);

router.get('/products', adminController.getProducts);



module.exports = router;