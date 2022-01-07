const Block = require('./block');

describe('Block', () => {
   const timestamp = '01/01/02';
   const lastHash = 'foo-hash';
   const hash = 'new-hash';
   const data = ['blockchain', 'transactions'];
   const block = new Block ({timestamp, lastHash, hash, data}); // b/c. variable same name as arguments defined can shorthand the map-key pair

    it('has a timestamp, lastHash, hash, and data', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
    });
});

