const fs = require('fs');
const path = require('path');
const crypto = require("crypto");

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
        return new Promise((resolve, reject) => {
            getProductsFromFile()
                .then(products => {
                    const updatedProducts = [...products];
                    console.log('updatedProds: ', updatedProducts);
                    updatedProducts.push(this);
                    fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                        if (err) {
                            return reject(err);
                        } else {
                            return resolve('product added');
                        };
                    });
                })
                .catch(err => {
                    throw err;
                });
        });
    }; //end save

    ////////////////////static methods//////////////////
    static fetchAllProducts() {
        return getProductsFromFile();
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

                    if (changeAtIndex === -1) {
                        reject('no such file in data');
                    } else {
                        const prodToChange = { id: _id, ...prodChanges };
                        console.log(prodToChange);
                        prodsToWrite.splice(changeAtIndex, 1, prodToChange);
                        fs.writeFile(p, JSON.stringify(prodsToWrite), (err) => {
                            if (err) {
                                return reject(err);
                            } else {
                                return resolve('product updated');
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
    	return new Promise((resolve,reject)=>{
    		getProductsFromFile()
    		.then(products=>{
    			const updatedProducts = [...products];
    			const delIndex = updatedProducts.findIndex(prod=>prod.id === _id);
    			
    			if(delIndex === -1){
    				reject('no such product');
    			}else{
    				updatedProducts.splice(delIndex,1);

    				fs.writeFile(p,JSON.stringify(updatedProducts), (err)=>{
    					if(err){
    						return reject(err);
    					}else{
    						return resolve('product successfully deleted from file');
    					}
    				});
    			}
    		})
    		.catch(err=> console.log(err));
    	})
    }; //end deleteProductById

}; //end class


//helper methods

const getProductsFromFile = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(p, "utf8", (error, file) => {
            if (error) {
                return reject(error);
            } else if (file === "") {
                return resolve([]);
            } else {
                return resolve(JSON.parse(file));
            };
        });
    });
};

const getProductById = (_id) => {
    return new Promise((resolve, reject) => {
        getProductsFromFile()
            .then(products => {
                const prod = products.find(prod => prod.id === _id);

                if (prod === undefined) {
                    reject('no such product');
                } else {
                    resolve(prod);
                };
            })
            .catch(err => {
                throw err;
            })
    })
}