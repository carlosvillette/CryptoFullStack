const TransactionPool = require('../wallet/transaction-pool');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet/wallet');

describe('TransactionPool()', () => {
    let transactionPool, transaction;

    beforeEach(() => {
        transactionPool = new TransactionPool();
        transaction = new Transaction({
            senderWallet: new Wallet(),
            recipient: 'fake-recipient',
            amount: 50
        });

    });

    describe('setTranswaction()', () => {
        it('adds a transaction', ()=> {
            transactionPool.setTransaction(transaction);

            expect(transactionPool.transactionMap[transaction.id]).toBe(transaction); // will use to be to make sure the actual instance of the object is the same
        });
    });
});