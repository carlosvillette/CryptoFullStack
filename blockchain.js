const Block = require('./block');
const cryptoHash = require('./cryptoHash');

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
            let newHash = cryptoHash(chain[j].timestamp, chain[j].lastHash,chain[j].data);
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