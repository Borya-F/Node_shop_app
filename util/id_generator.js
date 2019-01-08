const crypto = require('crypto');

const MIN_bytes = 4;
const MAX_bytes = 16;

exports.generate_user_id = () => {
    const numBytes = generateRandomNumBytes(MIN_bytes, MAX_bytes);
    return crypto.randomBytes(numBytes).toString("hex");
};

exports.generate_prodcut_id = () => {
    const numBytes = generateRandomNumBytes(MIN_bytes, MAX_bytes);
    return crypto.randomBytes(numBytes).toString("hex");
};

//helper functions
const generateRandomNumBytes = (MIN, MAX) => {
    return (Math.floor(Math.random() * (MAX - MIN)) + MIN);
};