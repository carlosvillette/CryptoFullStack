const EC = require('elliptic').ec;
const cryptoHash = require('./cryptoHash')

const ec = new EC('secp256k1');

function verifySignature({publicKey,data,signature}) {
    let key = ec.keyFromPublic(publicKey, 'hex');
    return key.verify(cryptoHash(data),signature);
};

module.exports = {ec, verifySignature};