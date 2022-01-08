const {GENESIS_DATA} = require('./config');
const cryptoHash = require('./cryptoHash');

class Block {
    // wrapping functions in map - key value structure to prevent misordered arguments
     constructor ( {timestamp, lastHash, hash, data } ) {
         this.timestamp = timestamp;
         this.lastHash = lastHash;
         this.hash = hash;
         this.data = data;
     }

     static genesis() {
         return new Block(GENESIS_DATA);
     }

     static mineBlock({lastBlock, data}) {
         const timestamp = Date.now();
         const lastHash = lastBlock.hash;
         return new Block({
             timestamp,
             lastHash,
             data,
             hash: cryptoHash(timestamp, lastHash, data)
         });
     }
}

module.exports = Block;