const {GENESIS_DATA, MINE_RATE} = require('./config');
const cryptoHash = require('./cryptoHash');

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

         if (difference > MINE_RATE) {
             return difficulty - 1;
         }

         return difficulty + 1;
     }

     static mineBlock({lastBlock, data}) {
         const timestamp = Date.now();
         const lastHash = lastBlock.hash;
         const difficulty = lastBlock.difficulty;
         let nonce = 0;
         let hash = cryptoHash(
             timestamp,
             nonce,
             difficulty,
             lastHash,
             data
         );
         while (hash.substring(0,difficulty) !== '0'.repeat(difficulty)) {
             nonce++;
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