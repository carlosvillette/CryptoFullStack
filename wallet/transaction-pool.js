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
}

module.exports = TransactionPool;