const fs = require('fs');
const util = require('util');
const path = require('path');
const crypto = require("crypto");

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

module.exports = class Cart {

	static fetchCartFileContent(){
		return getCartFileContent();
	}

	static addItemToCart(item_Id,item_price){
		return new Promise((resolve,reject)=>{
			getCartFileContent()
			.then(cart=>{
				
				const currentProducts = cart.cartProducts.map(item=>item.itemId);
				const cartContent = {...cart};

				if(!currentProducts.includes(item_Id)){

					cartContent.cartProducts.push({
						itemId: item_Id,
						qty: 1
					});

					cartContent.totalPrice += parseFloat(item_price);
					cartContent.totalPrice = +cartContent.totalPrice.toFixed(2);
					
				

				}else{
					
					const indexToAddAt = cartContent.cartProducts.findIndex(item => item.itemId === item_Id);
					cartContent.cartProducts[indexToAddAt].qty++;
					cartContent.totalPrice += parseFloat(item_price);
					cartContent.totalPrice = +cartContent.totalPrice.toFixed(2);

				};

				fs.writeFile(p,JSON.stringify(cartContent),(err)=>{
					if(err){
						return reject(err);
					}else{
						return resolve('product successfully added to cart');
					};
				});
			});
		});
	};


};	//end cart


//////////helper methods
getCartFileContent = () => {
	return new Promise((resolve,reject)=>{
		fs.readFile(p,'utf8',(err,fileContent)=>{
			let cart = {
				cartProducts: [],
				totalPrice: 0
			};

			if(err){
				return reject(err);
			}else if(fileContent === ''){
				return resolve(cart);
			}else{
				cart = JSON.parse(fileContent);
				return resolve(cart);
			};
		});
	});
};