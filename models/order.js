const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const OrderSchema = Schema({
	products: [{
		productData: {
			type: Schema.Types.ObjectId,
			ref: 'Product',
			required: true
		},
		qty: {
			type: Number,
			required: true
		}
	}],
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	}

})

module.exports = mongoose.model('Order',OrderSchema);