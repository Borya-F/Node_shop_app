const getDB = require('../util/database.js').getDB;
const ObjectId = require('mongodb').ObjectID;
const msg = require('../util/messagelog.js');

class User {
    constructor(username, email, cart, id = null) {
        this.name = username;
        this.email = email;
        this.cart = cart;

        if (id === null) {
            this._id = new ObjectId();
        } else {
            this._id = id;
        }
    };

    save() {
        return new Promise((resolve, reject) => {
            getDB()
                .then(db => {
                    return db.collection('users').insertOne(this);
                })
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    getCart() {
        return new Promise((resolve, reject) => {
            const prodIds = this.cart.items.map(item => item.product);


            getDB()
                .then(db => {
                    return db.collection('products').find({
                        "_id": { $in: prodIds }
                    }).toArray();
                })
                .then(products => {
                    return products.map(prod => {
                        return { ...prod,
                            qty: this.cart.items.find(item => {
                                return item.product.toString() === prod._id.toString();
                            }).qty
                        };
                    });
                })
                .then(protoProds => {
                    resolve(protoProds);
                })
                .catch(err => {
                    reject(err);
                });
        });
    };

    addToCart(prodId) {
        return new Promise((resolve, reject) => {

            const cartItemIndex = this.cart.items.findIndex(item => {
                return item.product.toString() === prodId;
            });

            let newQuantity = 1;
            const updatedCartItems = [...this.cart.items];

            if (cartItemIndex >= 0) {
                newQuantity = ++updatedCartItems[cartItemIndex].qty;
            } else {
                updatedCartItems.push({
                    product: ObjectId(prodId),
                    qty: newQuantity
                });
            };

            const updatedCart = {
                items: updatedCartItems
            };

            getDB()
                .then(db => {
                    return db.collection('users').updateOne({
                        "_id": ObjectId(this._id)
                    }, {
                        $set: {
                            cart: updatedCart
                        }
                    })
                })
                .then(result => {
                    resolve('successfully added item to cart');
                })
                .catch(err => {
                    reject(err);
                })

        });
    };

    deleteItemFromCart(prodId) {
    	return new Promise((resolve,reject)=>{
    		const updatedCartItems = this.cart.items.filter(item =>{
    			return item.product.toString() !== prodId.toString();
    		});

    		const updatedCart = {
    			items: updatedCartItems
    		};

    		getDB()
    		.then(db=>{
    			return db.collection('users').updateOne({
    				"_id":ObjectId(this._id)
    			}, {
    				$set: {
    					cart: updatedCart
    				}
    			})
    		})
    		.then(result=>{
    			resolve('item has been removed from cart');
    		})
    		.catch(err=>{
    			reject(err);
    		});
    	});
    };

    addOrder() {
    	return new Promise((resolve,reject)=>{

    		getDB()
    		.then(db=>{

    			const passedDB = Promise.resolve(db);

    			const prodIds = this.cart.items.map(item=>{
    				return item.product
    			});

    			const products = db.collection('products').find({
    				"_id": { $in: prodIds}
    			}).toArray();

    			return Promise.all([passedDB,products]);
    		})
    		.then(([db,products])=>{

    			const passedDB = Promise.resolve(db);
    			
    			const orderItems = products.map(prod => {
                        return { ...prod,
                            qty: this.cart.items.find(item => {
                                return item.product.toString() === prod._id.toString();
                            }).qty
                        };
                    });


    			const orderToAdd = {
    				items: [...orderItems],
    				userId: ObjectId(this._id)
    			};

    			const addOrderPromise = db.collection('orders').insertOne(orderToAdd);

    			return Promise.all([passedDB,addOrderPromise]);
    		})
    		.then(([db,result])=>{
    			return db.collection('users').updateOne({
    				"_id": ObjectId(this._id)
    			},{
    				$set: {
    					cart: {items: []}
    				}
    			})
    		})
    		.then(result=>{
    			this.cart = {items: []}; //reset local cart if all promisses resolve.
    			resolve('items successfully migrated from cart to order');
    		})
    		.catch(err=>{
    			reject(err,'userModel');
    		});
    	});
    };

    getOrders() {
    	return new Promise((resolve,reject)=>{

    		//get an array of orders
    		//orders.items is an array of objects containing productid and qty.
    		//get an array of the unique products in the items



    		getDB()
    		.then(db=>{
    			return db.collection('orders').find({
    				"userId": ObjectId(this._id)
    			}).toArray();
    		})
    		.then(orders=>{
    			resolve(orders);
    		})
    		.catch(err=>{
    			reject(err);
    		})

    	})
    }



    static fetchUserById(id) {
        return new Promise((resolve, reject) => {
            getDB()
                .then(db => {
                    return db.collection('users').findOne({
                        "_id": ObjectId(id)
                    });
                })
                .then(fetchedUser => {
                    resolve(fetchedUser);
                })
                .catch(err => {
                    reject(err);
                });
        });
    };
};

module.exports = User;