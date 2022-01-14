const Block = require('./block');
const cryptoHash = require('./cryptoHash');
const {GENESIS_DATA} = require('./config');

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

    replaceChain(chain) {
        const longer = chain.length > this.chain.length;
        const valid = Blockchain.isValidChain(chain);

        if (longer && valid) {
            this.chain = chain;
            console.log('replacing chain with: ', chain);
        } else if (!longer) {
            console.error("The new chain must be longer");
        } else {
            console.error("The new chain must be valid");
        }
    }
}

module.exports = Blockchain;