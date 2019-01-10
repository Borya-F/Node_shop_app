const Sequelize = require('sequelize');
const db = require('../util/database.js');

const Order = db.define('order',{
	id: {
		type: Sequelize.STRING,
		primaryKey: true,
		unique: true,
		allowNull: false
	},
	userId: {
      type: Sequelize.STRING
  	}
});

module.exports = Order;