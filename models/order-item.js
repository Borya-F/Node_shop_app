const Sequelize = require('sequelize');
const db = require('../util/database.js');

const OrderItem = db.define('orderItem',{
	id: {
		type: Sequelize.STRING,
		primaryKey: true,
		unique: true,
		allowNull: false
	},
	quantity: {
		type: Sequelize.INTEGER
	}
});

module.exports = OrderItem;