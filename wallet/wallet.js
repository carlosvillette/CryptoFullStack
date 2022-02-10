const {STARTING_BALANCE} = require('../config');
const {ec} = require('../util/elliptic');
const cryptoHash = require('../util/cryptoHash')

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;
        this.keyPair = ec.genKeyPair();

        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(data) {
        let signature = this.keyPair.sign(cryptoHash(data));
        return signature.toDER();
    }
}

module.exports = Wallet;