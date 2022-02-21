const TransactionPool = require('../wallet/transaction-pool');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet/wallet');

describe('TransactionPool()', () => {
    let transactionPool, transaction, senderWallet;

    beforeEach(() => {
        transactionPool = new TransactionPool();
        senderWallet = new Wallet();
        transaction = new Transaction({
            senderWallet: senderWallet,
            recipient: 'fake-recipient',
            amount: 50
        });

    });

    describe('setTransaction()', () => {
        it('adds a transaction', ()=> {
            transactionPool.setTransaction(transaction);

            expect(transactionPool.transactionMap[transaction.id]).toBe(transaction); // will use to be to make sure the actual instance of the object is the same
        });
    });

    describe('existingTransaction()', () => {
        it('returns an existing transaction with an input address', ()=> {
            transactionPool.setTransaction(transaction);

            expect(transactionPool.existingTransaction({address: senderWallet.publicKey})).toBe(transaction); // will use to be to make sure the actual instance of the object is the same
        });
    });
});