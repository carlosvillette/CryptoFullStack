const crypto = require('crypto');

const cryptoHash = (...inputs) => {
    const hash = crypto.createHash('sha256');
    //had to stringify the individual inputs to correct for receiving the same hash even with a modified object since referencing the same altered object will give the same hash
    //look at transaction.test.js in describe block 'update()' for the 'resigns the transaction' test to understand why this change had to be made for it to pass
    hash.update(inputs.map((input) => JSON.stringify(input)).sort().join(' '));

    return hash.digest('hex');
};

module.exports = cryptoHash;