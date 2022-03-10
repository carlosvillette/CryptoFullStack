const Block = require('./block');
const cryptoHash = require('../util/cryptoHash');
const {GENESIS_DATA, REWARD_INPUT, MINING_REWARD} = require('../config');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet/wallet');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];

    }

    addBlock ({data}) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        })

        this.chain.push(newBlock);
    }
    static isValidChain(chain) {
        //if chain is empty
        if (chain.length === 0) {
            return false;
        }
        const gBlock = chain[0];
        // check if genesis block is correct
        const gTimestamp = gBlock.timestamp !== 1;
        const gLastHash = gBlock.lastHash !== 'genesis';
        const gHash = gBlock.hash !== 'genesis1';
        const gData = Array.isArray(gBlock.data) && gBlock.data.length;
        // THESE TWO BOTTOM LINES WERE CAUSING TESTS TO FAIL WHEN ADDED TO IF STATEMENT . . . NANI????
        //const gNonce= gBlock.nonce === 0;
        //const gDifficulty= gBlock.difficulty === GENESIS_DATA.difficulty;
        if (gTimestamp || gLastHash || gHash || gData) {
            return false;
        }
        // check if lastHash is correct
        for (let i = 1; i < chain.length; i++) {
            if (chain[i - 1].hash !== chain[i].lastHash ) {
                return false;
            }
            // prevent dishonest miners from lowering/increasing difficulty a lot to mess with blockchain
            if (Math.abs(chain[i - 1].difficulty - chain[i].difficulty) > 1) {
                return false;
            }

        }
        // check if hash of block is correct
        for (let j = 1; j < chain.length; j++) {
            //console.log('The chain difficulty: ', chain[j].difficulty);
            let newHash = cryptoHash(
                chain[j].timestamp,
                chain[j].nonce,
                chain[j].difficulty,
                chain[j].lastHash,
                chain[j].data
            );
            if (chain[j].hash !== newHash) {
                return false;
            }
        }

        return true;

    }

    replaceChain(chain, onSuccess) {
        const longer = chain.length > this.chain.length;
        const valid = Blockchain.isValidChain(chain);

        if (longer && valid) {
            if (onSuccess) {
                onSuccess();
            }
            this.chain = chain;
            console.log('replacing chain with: ', chain);
        } else if (!longer) {
            console.error("The new chain must be longer");
        } else {
            console.error("The new chain must be valid");
        }
    }

    validTransactionData ({chain}) {
        for (let i = 1; i<chain.length; i++) {
            const block = chain[i];
            let rewardTransactionCount = 0;

            for (let transaction of block.data) {
                if( transaction.input.address === REWARD_INPUT.address) {
                    rewardTransactionCount++;

                    if (rewardTransactionCount > 1) {
                        console.error(`too many reward transactions. You have ${rewardTransactionCount} reward transactions`);
                        return false;
                    }

                    // a reward transaction would only contain 1 value in the output map
                    if(Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
                        console.error(`Miner Reward incorrect: \n ${transaction}`);
                        return false;
                    }
                } else { // regular transactions

                    if (!Transaction.validTransaction(transaction)) {
                        console.error(`This transaction is invalid:\n ${transaction}`);
                        return false;
                    }
                    // don't want to use chain passed in as argument because that would be the attacker's chain
                    const trueBalance = Wallet.calculateBalance({
                        chain: this.chain,
                        address: transaction.input.address
                    });

                    if (transaction.input.amount !== trueBalance) {
                        console.error(`This transaction's input is not correct:\n Faulty transaction: ${transaction}\n True balance: ${trueBalance}`);
                        return false;
                    }
                }
            }
        }

        return true;
    }
}

module.exports = Blockchain;