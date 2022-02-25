const Transaction = require('./transaction');

class TransactionPool {
    constructor() {
        this.transactionMap = {};
    }

    setTransaction(transaction) {
        this.transactionMap[transaction.id] = transaction;
    }

    setMap(transactionMap) {
        this.transactionMap = transactionMap;
    }

    existingTransaction({address}) {
        const transactions = Object.values(this.transactionMap);
        return transactions.find(transaction => transaction.input.address === address);

    }

    validTransactions() {
        let validTransaction = [];
        for (const id in this.transactionMap) {
            if (Transaction.validTransaction(this.transactionMap[id]) && this.transactionMap.hasOwnProperty(id)) {
                validTransaction.push(this.transactionMap[id]);
            }
        }

        return validTransaction;
    }

    //will be used for final step for mine transactions method
    clear() {
        this.transactionMap = {};
    }

    //what peers will call when they accept a new blockchain to be replaced
    clearBlockchainTransactions({chain}) {
        for (const block of chain) {
            //must skip genesis block
            if (block.lastHash === 'genesis') {
                continue;
            }
            const transactions = block.data;
            for (let transaction of transactions){
                if (this.transactionMap[transaction.id]) {
                    delete this.transactionMap[transaction.id];
                }
            }

        }
    }

}

module.exports = TransactionPool;