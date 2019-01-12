const msg = require('../util/messagelog.js');
const getDB = require('../util/database.js').getDB;
const ObjectId = require('mongodb').ObjectID;

class Product {
    constructor(userId,title,price,desc,imgUrl){
        this.userId = ObjectId(userId);
        this.title = title;
        this.price = price;
        this.desc = desc;
        this.imgURL = imgUrl;
    };

    save(){
        return new Promise((resolve,reject)=>{
            getDB()
            .then(db=>{
                return db.collection('products').insertOne(this);
            })
            .then(result=>{
                resolve(result);
            })
            .catch(err=>{
                reject(err);
            });
        });
        
    };

    static fetchAll(){
        return new Promise((resolve,reject)=>{
            getDB()
            .then(db=>{
                return db.collection('products').find().toArray();
            })
            .then(products=>{
                resolve(products);
            })
            .catch(err=>{
                reject(err);
            });
        });
    };

    static fetchProductById(id){
        return new Promise((resolve,reject)=>{
            getDB()
            .then(db=>{
                return db.collection('products').findOne({
                    "_id": ObjectId(id)
                });
            })
            .then(fetchedProd=>{
                resolve(fetchedProd);
            })
            .catch(err=>{
                reject(err);
            });
        });
    };

    static deleteProductById(id){
        return new Promise((resolve,reject)=>{
            getDB()
            .then(db=>{
                return db.collection('products').deleteOne({
                    "_id": ObjectId(id)
                });
            })
            .then(result=>{
                resolve(result);
            })
            .catch(err=>{
                reject(err);
            })
        });
    };

    static updateProductById(id,updatedProduct){
        return new Promise((resolve,reject)=>{
            getDB()
            .then(db=>{
                return db.collection('products').updateOne({
                    "_id": ObjectId(id)
                },{
                    $set: {
                        "title": updatedProduct.title,
                        "price": updatedProduct.price,
                        "desc": updatedProduct.desc,
                        "imgURL": updatedProduct.imgUrl
                    }
                });
            })
            .then(result=>{
                resolve(result);
            })
            .catch(err=>{
                reject(err);
            })
        });
    };
};




module.exports = Product;