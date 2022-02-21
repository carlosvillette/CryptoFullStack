class TransactionMiner {

    constructor({blockchain, transactionPool, wallet, pubsub}) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubsub = pubsub;
    }

    mineTransaction() {
        // get the transaction pool's valid transaction

        // generate the miner's reward

        // add a block with theses transactions to the blockchain

        // broadcast the updated blockchain

        // clear the pool
    }
}

module.exports = TransactionMiner;