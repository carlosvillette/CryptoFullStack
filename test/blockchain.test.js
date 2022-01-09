const Block = require('../block');
const Blockchain = require('../blockchain');

describe('Blockchain', () => {
    let blockchain;

    beforeEach( () => {
        blockchain = new Blockchain();
    });

    it('contains a chain array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('starts with a genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block to the chain', () => {
        const newData = 'new data';
        blockchain.addBlock({data: newData});

        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
    });

    describe('isValidChain', () => {
        describe('when a chain does not start with the genesis block', () => {
           it('returns false', () => {
               blockchain.chain[0] = {data: 'wrong block'};
               expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
           });
        });

        describe('when a chain starts with the genesis block', () => {

            beforeEach( () => {
                blockchain.addBlock({data: 'hello'});
                blockchain.addBlock({data: 'hello World'});
                blockchain.addBlock({data: 'hello Blocks'});
            });

            describe('a last hash reference is different', () => {
                it('returns false', () => {

                    blockchain.chain[3].lastHash = 'wrongHash';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('contains an invalid field', () => {
                it('returns false', () => {

                    blockchain.chain[3].data = 'wrong data';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('has no errors', () => {
                it('returns true', () => {

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });
});