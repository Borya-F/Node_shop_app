const getDB = require('../util/database.js').getDB;
const ObjectId = require('mongodb').ObjectID;
const msg = require('../util/messagelog.js');

class User{
	constructor(username,email){
		this.name = username;
		this.email = email;
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