class Block {
    // wrapping functions in map - key value structure to prevent misordered arguments
     constructor ( {timestamp, lastHash, hash, data } ) {
         this.timestamp = timestamp;
         this.lastHash = lastHash;
         this.hash = hash;
         this.data = data;
     }
}

module.exports = Block;