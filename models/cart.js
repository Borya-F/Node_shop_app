const Sequelize = require('sequelize');
const db = require('../util/database.js');

const Cart = db.define('cart',{
	id: {
		type: Sequelize.STRING,
		primaryKey: true,
		unique: true,
		allowNull: false
	}
});

module.exports = Cart;