// const getDB = require('../util/database.js').getDB;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const msg = require('../util/messagelog.js');


const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            qty: {
                type: Number,
                required: true
            }
        }],
    }
});

UserSchema.methods.addToCart = function(productId){


	const cartItemIndex = this.cart.items.findIndex(item => {
        return item.productId.toString() === productId;
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartItemIndex >= 0) {
        newQuantity = ++updatedCartItems[cartItemIndex].qty;
    } else {
        updatedCartItems.push({
            productId: productId,
            qty: newQuantity
        });
    };

    const updatedCart = {
        items: updatedCartItems
    };

    this.cart = updatedCart;

    return this.save();

};

UserSchema.methods.deleteItemFromCart = function(productId){

	const updatedCartItems = this.cart.items.filter(item=>{
		return item.productId.toString() !== productId.toString();
	});

	this.cart.items = updatedCartItems;
	return this.save();
};

UserSchema.methods.clearCart = function(){
	this.cart = {items: []};
	return this.save();
}

module.exports = mongoose.model('User', UserSchema);


