const {GENESIS_DATA, MINE_RATE} = require('../config');
const cryptoHash = require('../util/cryptoHash');
const hexToBinary = require('hex-to-binary');

class Block {
    // wrapping functions in map - key value structure to prevent misordered arguments
     constructor ( {timestamp, lastHash, hash, data,nonce, difficulty } ) {
         this.timestamp = timestamp;
         this.lastHash = lastHash;
         this.hash = hash;
         this.data = data;
         this.nonce = nonce;
         this.difficulty = difficulty;
     }

     static genesis() {
         return new Block(GENESIS_DATA);
     }

     static adjustDifficulty({originalBlock, timestamp}) {
         const difficulty = originalBlock.difficulty;

         const difference = timestamp - originalBlock.timestamp;

         if (difficulty < 1) {
             return 1;
         }

         if (difficulty > 64) {
             return 64;
         }

         if (difference > MINE_RATE) {
             return difficulty - 1;
         }

         if (difference < MINE_RATE) {
             return difficulty + 1;
         }

         return difficulty;
     }

     static mineBlock({lastBlock, data}) {
         let timestamp = Date.now();
         const lastHash = lastBlock.hash;
         let difficulty = lastBlock.difficulty;
         let nonce = 0;
         let hash = cryptoHash(
             timestamp,
             nonce,
             difficulty,
             lastHash,
             data
         ); // may be a good idea to update timestamp
         while (hexToBinary(hash).substring(0,difficulty) !== '0'.repeat(difficulty)) {
             nonce++;
             timestamp = Date.now();
             difficulty = Block.adjustDifficulty({originalBlock: lastBlock,timestamp});
             hash = cryptoHash(
                 timestamp,
                 nonce,
                 difficulty,
                 lastHash,
                 data
             );
         }
         return new Block({
             timestamp,
             lastHash,
             data,
             hash,
             nonce,
             difficulty
         });
     }
}

module.exports = Block;