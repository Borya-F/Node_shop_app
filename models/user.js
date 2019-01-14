const getDB = require('../util/database.js').getDB;
const ObjectId = require('mongodb').ObjectID;
const msg = require('../util/messagelog.js');

class User{
	constructor(username,email,cart = {items:[]},id=null){
		this.name = username;
		this.email = email;
		this.cart = cart;

		if(id === null){
			this._id = new ObjectId();
		}else{
			this._id = id;
		}
	};

	save(){
		return new Promise((resolve,reject)=>{
			getDB()
			.then(db=>{
				return db.collection('users').insertOne(this);
			})
			.then(result=>{
				resolve(result);
			})
			.catch(err=>{
				reject(err);
			});
		});
	};

	addToCart(prod){
		return new Promise((resolve,reject)=>{
			
			const updatedCart = {items:[{...prod, qty: 1}]}	
			getDB()
			.then(db=>{
				return db.collection('users').updateOne({
					"_id": ObjectId(this._id)
				},{
					$set: {
						cart: updatedCart
					}
				})
			})
			.then(result=>{
				resolve('successfully added item to cart');
			})
			.catch(err=>{
				reject(err);
			})
			
		});
	};

	static fetchUserById(id){
		return new Promise((resolve,reject)=>{
			getDB()
			.then(db=>{
				return db.collection('users').findOne({
					"_id": ObjectId(id)
				});
			})
			.then(fetchedUser=>{
				resolve(fetchedUser);
			})
			.catch(err=>{
				reject(err);
			});
		});
	};
};

module.exports = User;