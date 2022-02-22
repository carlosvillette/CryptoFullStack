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

    describe('validTransactions()', () => {
        let validTransactions, errorMock;

        beforeEach(() => {
            validTransactions = [];
            // want to suppress console.error messages from Transaction.validTransaction()
            errorMock = jest.fn();
            global.console.error = errorMock;

            for (let i=0; i<10; i++) {
                transaction = new Transaction({
                    senderWallet,
                    recipient: 'new-recipient',
                    amount: 30
                });

                if (i%3===0) {
                    transaction.input.amount = 99999999;
                } else if (i%3===1) {
                    transaction.input.signature = new Wallet().sign('foo')
                } else {
                    validTransactions.push(transaction);
                }

                transactionPool.setTransaction(transaction);
            }
        });

        it('returns the valid transactions', () => {
            expect(transactionPool.validTransactions()).toEqual(validTransactions);
        });

        it('logs errors of  invalid transactions', () => {
            transactionPool.validTransactions();
            expect(errorMock).toHaveBeenCalled();
        });
    });

});