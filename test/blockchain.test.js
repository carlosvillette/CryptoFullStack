const Block = require('../blockchain/block');
const Blockchain = require('../blockchain/blockchain');
const cryptoHash = require('../util/cryptoHash');
const Wallet = require("../wallet/wallet");
const Transaction = require('../wallet/transaction');

describe('Blockchain', () => {
    let blockchain, newChain, originalChain, error;


    beforeEach( () => {
        blockchain = new Blockchain();
        newChain = new Blockchain();
        originalChain = blockchain.chain;

        error = jest.fn();

        global.console.error = error;
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

    describe('isValidChain()', () => {
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

            describe('chain has a block with a jumped difficulty', () => {
                it('returns false', () => {
                    const lastBlock = blockchain.chain[blockchain.chain.length - 1];

                    const lastHash = lastBlock.lastHash;

                    const  timestamp = Date.now();
                    const nonce = 0;
                    const data = [];
                    const difficulty = lastBlock.difficulty - 3;
                    const hash = cryptoHash(
                        timestamp,
                        lastHash,
                        difficulty,
                        nonce,
                        data
                    );
                    const badBlock = new Block({timestamp,lastHash,hash,data,nonce,difficulty});

                    blockchain.chain.push(badBlock);

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('has no errors', () => {
                it('returns true', () => {

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                    //console.log(blockchain.chain);
                });
            });
        });
    });

    describe('replaceChain()', () => {
        let log;

        beforeEach( () => {
            // this will let us control if we want to suppress the log message
            log = jest.fn();

            global.console.log = log;
        });
        describe('when the chain is shorter', () => {
            beforeEach( () => {
                newChain.chain[0] = {data: 'newChain'};
                blockchain.replaceChain(newChain.chain);
            });
            it('does not replace the chain', () => {

                expect(blockchain.chain).toEqual(originalChain);
            });

            it( 'logs an error',() => {
                expect(error).toHaveBeenCalled();
            });
        });

        describe('when the chain is longer', () => { //blockchain.chain is empty
            beforeEach( () => {
                newChain.addBlock({data: 'hello'});
                newChain.addBlock({data: 'hello World'});
                newChain.addBlock({data: 'hello Blocks'});
            });
            describe('the chain is not valid', () => {
                beforeEach( () => {
                    newChain.chain[1].hash = 'wrong hash';
                    blockchain.replaceChain(newChain.chain);
                });
                it('does not replace the chain', () => {

                    expect(blockchain.chain).toEqual(originalChain);
                });
                it( 'logs an error',() => {
                    expect(error).toHaveBeenCalled();
                });
            });

            describe('the chain is valid', () => {
                beforeEach( () => {
                    blockchain.replaceChain(newChain.chain);
                });
                it('it does replace the chain', () => {
                    expect(blockchain.chain).toEqual(newChain.chain);
                });
                it( 'logs the chain',() => {
                    expect(log).toHaveBeenCalled();
                });
            });
        });
    });

    describe('validTransactionData()', () => {
        let transaction, rewardTransaction, wallet

        beforeEach(() => {
            wallet = new Wallet();
            transaction = wallet.createTransaction({
                amount: 50,
                recipient: 'recipient-address',
            });
            rewardTransaction = Transaction.rewardTransaction({minerWallet: wallet});
        });

        describe('the transaction data is valid', () => {
            it('returns true', () => {
                newChain.addBlock({data: [transaction,rewardTransaction]});

                expect(blockchain.validTransactionData({ chain: newChain.chain})).toBe(true);
                expect(error).not.toHaveBeenCalled();
            });
        });

        describe('the transaction data has multiple rewards', () => {
            it('returns false and logs an error', () => {
                newChain.addBlock({data: [transaction, rewardTransaction, rewardTransaction]});

                expect(blockchain.validTransactionData({ chain: newChain.chain})).toBe(false);
                expect(error).toHaveBeenCalled();
            });
        });

        describe('the transaction data has at least one malformed outputmap', () => {
            describe('the transaction is not a reward transaction', () => {
                it('returns false and logs an error', () => {
                    transaction.outputMap[wallet.publicKey] = 123456;

                    newChain.addBlock({data: [transaction, rewardTransaction]});

                    expect(blockchain.validTransactionData({ chain: newChain.chain})).toBe(false);
                    expect(error).toHaveBeenCalled();
                });
            });

            describe('the transaction is a reward transaction', () => {
                it('returns false and logs an error', () => {
                    rewardTransaction.outputMap[wallet.publicKey] = 123456;

                    newChain.addBlock({data: [transaction, rewardTransaction]});

                    expect(blockchain.validTransactionData({ chain: newChain.chain})).toBe(false);
                    expect(error).toHaveBeenCalled();
                });
            });
        });

        describe('the transaction data has at least one malformed input', () => {
            it('returns false and logs an error', () => {

            });
        });

        describe('the transaction data has multiple identical transactions', () => {
            it('returns false and logs an error', () => {

            });
        });
    });
});