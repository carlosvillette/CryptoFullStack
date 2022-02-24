//const  uuid = require('uuid/v1');
const { v1: uuid } = require('uuid');
const {verifySignature} = require('../util/elliptic');
const {REWARD_INPUT, MINING_REWARD} = require('../config');

class Transaction {
    constructor({senderWallet, recipient, amount, outputMap, input}) {
        this.id = uuid().split('-').join('');
        // public keys are used as the keys that map to the wallet amount
        this.outputMap = outputMap || this.makeOutputMap({senderWallet,recipient, amount});
        this.input = input || this.createInput({senderWallet, outputMap: this.outputMap});

    }

    makeOutputMap({senderWallet, recipient, amount}) {
        const outputMap = {};

        outputMap[recipient] = amount;
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

        return outputMap;
    }

    createInput({senderWallet, outputMap}) {
        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(outputMap)
        };
    }

    static validTransaction(transaction) {
        const {input, outputMap} = transaction;

        const {address, amount, signature} = input;

        const outputTotal = Object.values(outputMap)
            .reduce((total, outputAmount) => total + outputAmount);

        if (amount !== outputTotal) {
            console.error(`invalid transaction from ${address}`);
            return false;
        }

        if (!verifySignature(
            {publicKey:address,
                data:outputMap,
                signature: signature }
        )) {
            console.error(`Invalid signature from ${address}`);
            return false;
        }

        return true;
    }

    static rewardTransaction({minerWallet}) {
        const outputMap = {};

        outputMap[minerWallet.publicKey] = MINING_REWARD

        const input = REWARD_INPUT;

        return new this({outputMap, input});
    };

    update({senderWallet, recipient, amount}) {
        if (amount > this.outputMap[senderWallet.publicKey]) {
            throw new Error('Amount exceeds balance');
        }

        if (!this.outputMap[recipient]) {
            this.outputMap[recipient] = amount;
        } else {
            this.outputMap[recipient] = this.outputMap[recipient] + amount;
        }

        this.outputMap[senderWallet.publicKey] -= amount;
        this.input.signature = senderWallet.sign(this.outputMap);
    }
}

module.exports = Transaction;