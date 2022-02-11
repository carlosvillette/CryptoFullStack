//const  uuid = require('uuid/v1');
const { v1: uuid } = require('uuid');

class Transaction {
    constructor({senderWallet, recipient, amount}) {
        this.id = uuid().split('-').join();
        this.outputMap = this.makeOutputMap({senderWallet,recipient, amount});

    }

    makeOutputMap({senderWallet, recipient, amount}) {
        const outputMap = {};

        outputMap[recipient] = amount;
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

        return outputMap;
    }
}

module.exports = Transaction;