const Transaction = require('../wallet/transaction');

class TransactionMiner {

    constructor({blockchain, transactionPool, wallet, pubsub}) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubsub = pubsub;
    }

    mineTransaction() {
        // get the transaction pool's valid transaction
        const validTransactions = this.transactionPool.validTransactions();

        // generate the miner's reward
        const minerReward = Transaction.rewardTransaction({minerWallet: this.wallet});

        // add a block with theses transactions to the blockchain
        validTransactions.push(minerReward);
        this.blockchain.addBlock({data: validTransactions});

        // broadcast the updated blockchain
        this.pubsub.broadcastChain();

        // clear the pool
        this.transactionPool.clear();
    }
}

module.exports = TransactionMiner;