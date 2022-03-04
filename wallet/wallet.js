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

    static calculateBalance({chain,address}) {
        let summation = 0;
        for (let block = chain.length -1; block > 0; block--) {
            for (const transaction of chain[block].data) {
                if (transaction.input.address === address && transaction.outputMap[address]) {
                    return transaction.outputMap[address] + summation;
                }
                if (transaction.outputMap[address]) {
                    summation += transaction.outputMap[address];
                }
            }
        }
        return summation + STARTING_BALANCE;
    }
}

module.exports = Wallet;