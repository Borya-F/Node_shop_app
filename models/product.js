const fs = require('fs');
const path = require('path');
const crypto = require("crypto");
const db = require('../util/database.js');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

module.exports = class Product {
    constructor(_title, _price, _desc, _imgURL = '') {

        this.id = crypto.randomBytes(8).toString("hex");
        this.title = _title;
        this.price = _price;
        this.desc = _desc;


        if (_imgURL === '') {
            this.imgURL = "https://picsum.photos/150/150/?random";
        } else {
            this.imgURL = _imgURL;
        };
    }; //end constructor

    save() {
        return db.execute(
            `INSERT INTO products VALUES (?,?,?,?,?);`,
            [this.id,this.title,this.price,this.desc,this.imgURL]
        );
        
    }; //end save

    ////////////////////static methods//////////////////
    static fetchAllProducts() {
        return getProductsFromDB();
    };

    static fetchProductById(_id) {
        return getProductById(_id);
    };

    static updateProduct(_id, prodChanges) {
        return new Promise((resolve, reject) => {
            getProductsFromFile()
                .then(products => {
                    const prodsToWrite = [...products];
                    const changeAtIndex = prodsToWrite.findIndex(prod => prod.id === _id);
                    const changedPrice = prodChanges.price;

                    if (changeAtIndex === -1) {
                        reject('no such file in data');
                    } else {
                        const prodToChange = { id: _id, ...prodChanges };
                        prodsToWrite.splice(changeAtIndex, 1, prodToChange);
                        fs.writeFile(p, JSON.stringify(prodsToWrite), (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                const priceDiff = parseFloat(changedPrice) - parseFloat(products[changeAtIndex].price);
                                resolve(priceDiff);
                            };
                        });
                    };
                })
                .catch(err => {
                    throw err;
                });
        });
    }; //end update product

    static deleteProductById(_id) {
    	return db.execute(
            `DELETE FROM products WHERE products.id = ?`
        ),[_id];
    }; //end deleteProductById

}; //end class


//helper methods

const getProductsFromDB = () => {
    return db.execute(`
        SELECT * from products
    `);
};

const getProductById = (_id) => {

    console.log('retrieve el with id:', _id);
    return db.execute(` 
        SELECT * from products 
        WHERE products.id = ?;
    `,[_id]);
};