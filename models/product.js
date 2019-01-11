const msg = require('../util/messagelog.js');
const getDB = require('../util/database.js').getDB;

class Product {
    constructor(title,price,desc,imgUrl){
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
            })
        })
        
    };
};


// const Sequelize = require('sequelize');
// const db = require('../util/database.js');

// const Product = db.define('product', {
//     id: {
//     	type: Sequelize.STRING,
//     	primaryKey: true,
//     	unique: true,
//     	allowNull: false
//     },
//     title: {
//     	type: Sequelize.STRING,
//     	allowNull: false
//     },
//     price: {
//     	type: Sequelize.DOUBLE,
//     	allowNull: false
//     },
//     desc: {
//     	type: Sequelize.STRING,
//     	allowNull: true
//     },
//     imgURL: {
//     	type: Sequelize.STRING,
//     	allowNull: true
//     }
// })

module.exports = Product;