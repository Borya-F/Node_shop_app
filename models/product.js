
const Sequelize = require('sequelize');
const db = require('../util/database.js');

const Product = db.define('product', {
    id: {
    	type: Sequelize.STRING,
    	primaryKey: true,
    	unique: true,
    	allowNull: false
    },
    title: {
    	type: Sequelize.STRING,
    	allowNull: false
    },
    price: {
    	type: Sequelize.DOUBLE,
    	allowNull: false
    },
    desc: {
    	type: Sequelize.STRING,
    	allowNull: true
    },
    imgURL: {
    	type: Sequelize.STRING,
    	allowNull: true
    }
})

module.exports = Product;