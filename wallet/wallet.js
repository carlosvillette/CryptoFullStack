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

    createTransaction({amount, recipient, chain}) {
        if (chain) {
            this.balance = Wallet.calculateBalance({
                chain,
                address: this.publicKey
            });
        }

        if (amount > this.balance) {
            throw new Error('Amount exceeded balance');
        }

        return new Transaction({senderWallet: this, recipient, amount});
    }

    static calculateBalance({chain,address}) {
        let summation = 0;
        let inputOutputAddressSame = false;
        for (let block = chain.length -1; block > 0; block--) {
            for (const transaction of chain[block].data) {

                if (transaction.input.address === address && transaction.outputMap[address]) {
                    inputOutputAddressSame = true;
                }
                if (transaction.outputMap[address]) {
                    summation += transaction.outputMap[address];
                }
            }
            if (inputOutputAddressSame) {
                return summation;
            }
        }
        return summation + STARTING_BALANCE;
    }
}

module.exports = Wallet;