const {STARTING_BALANCE} = require('../config');
const {ec} = require('../util/elliptic');
const Transaction = require('./transaction');
const cryptoHash = require('../util/cryptoHash');

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;
        this.keyPair = ec.genKeyPair();

        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(data) {
        let signature = this.keyPair.sign(cryptoHash(data));
        return signature;
    }

    createTransaction({amount, recipient}) {
        if (amount > this.balance) {
            throw new Error('Amount exceeded balance');
        }

        return new Transaction({senderWallet: this, recipient, amount});
    }
}

module.exports = Wallet;