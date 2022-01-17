const Block = require('../block');
const {GENESIS_DATA, MINE_RATE} = require('../config');
const cryptoHash = require('../cryptoHash');

describe('Block', () => {
   const timestamp = 2000;
   const lastHash = 'foo-hash';
   const hash = 'new-hash';
   const data = ['blockchain', 'transactions'];
   const nonce = 1;
   const difficulty= 5;
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

        it('adjusts the difficulty', () => {
            const results = [lastBlock.difficulty + 1,lastBlock.difficulty - 1];

            expect(mineblock.difficulty).toBe(0);
            expect(results.includes(mineblock.difficulty)).toBe(true);
        });

    });

    describe('adjustDifficulty()',() => {
        it('Raises the difficulty for mined blocks',  () => {
            expect(Block.adjustDifficulty({
                originalBlock: block, timestamp: block.timestamp + MINE_RATE - 100
            })).toEqual(block.difficulty + 1);
        });

        it('Lowers the difficulty for mined blocks',  () => {
            expect(Block.adjustDifficulty({
                originalBlock: block, timestamp: block.timestamp + MINE_RATE + 100
            })).toEqual(block.difficulty - 1);
        });

        it('has a lower difficulty level of one',  () => {
            block.difficulty = -1;

            expect(Block.adjustDifficulty({originalBlock: block,timestamp: block.timestamp})).toEqual(1);
        });

    });
});

