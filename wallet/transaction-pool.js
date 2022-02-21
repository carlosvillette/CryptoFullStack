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
}

module.exports = TransactionPool;