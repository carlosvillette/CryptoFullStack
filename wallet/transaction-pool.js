class TransactionPool {
    constructor() {
        this.transactionMap = {};
    }

    setTransaction(transaction) {
        this.transactionMap[transaction.id] = transaction;
    }

    existingTransaction({address}) {
        const transactions = Object.values(this.transactionMap);
        return transactions.find(transaction => transaction.input.address === address);
        /*
        for (let transaction of Object.values(this.transactionMap)) {
            if (transaction.input.address === address) {
                return transaction;
            }
        }

         */
    }
}

module.exports = TransactionPool;