const Block = require('../block');
const {GENESIS_DATA} = require('../config');
const cryptoHash = require('../cryptoHash');

describe('Block', () => {
   const timestamp = '01/01/02';
   const lastHash = 'foo-hash';
   const hash = 'new-hash';
   const data = ['blockchain', 'transactions'];
   const nonce = 1;
   const difficulty= 1;
   const block = new Block ({timestamp, lastHash, hash, data, nonce, difficulty}); // b/c. variable same name as arguments defined can shorthand the map-key pair

    it('has a timestamp, lastHash, hash, data, nonce, and difficulty', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });

    describe('genesis function', () => {
        const genesisBlock = Block.genesis();

        it('returns a block instance',  () => {
            expect(genesisBlock instanceof Block).toBe(true);
        });

        it('returns the genesis data',  () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });

    describe("mineBlock", () =>{
        const lastBlock = Block.genesis();
        const data = 'the data';
        const mineblock = Block.mineBlock({lastBlock, data, nonce, difficulty});

        it('Returns a Block instance', () => {
            expect(mineblock instanceof Block).toBe(true);
        });

        it('sets the lastHash to be the hash of the lastBlock', ()=> {
            expect(mineblock.lastHash).toEqual(lastBlock.hash);
        });

        it('sets the data field', () => {
            expect(mineblock.data).toEqual(data);
        });

        it('sets the timestamp field', () => {
            expect(mineblock.timestamp).not.toEqual(undefined);
        });

        it('creates a sha256 hash based on the proper inputs', () => {
            expect(mineblock.hash)
                .toEqual(cryptoHash(
                    mineblock.timestamp,
                    mineblock.nonce,
                    mineblock.difficulty,
                    lastBlock.hash,
                    data
                    )
                );
        });

        it('sets a hash that matches the difficulty value', () => {
            expect(mineblock.hash.substring(0,mineblock.difficulty))
                .toEqual('0'.repeat(mineblock.difficulty));
        });
    });
});

