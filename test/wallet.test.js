const Wallet = require('../wallet/wallet.js');
const Transaction = require('../wallet/transaction');
const {verifySignature} = require('../util/elliptic');
const {STARTING_BALANCE} = require('../config');
const Blockchain = require('../blockchain/blockchain');

describe('Wallet', () => {
    let wallet;

    beforeEach( () => {
        wallet = new Wallet();
    });

    it('has a balance', () => {
        expect(wallet).toHaveProperty('balance');
    });

    it('has a public key', () => {
        expect(wallet).toHaveProperty('publicKey');
    });

    describe('signing data', () => {
        const data = 'foobar';

        it('verifies a signature', () => {
            expect(
                verifySignature({
                    publicKey: wallet.publicKey,
                    data,
                    signature: wallet.sign(data)
                })
            ).toBe(true);
        });

        it('does not verify an invalid signature', () => {
            expect(
                verifySignature({
                    publicKey: wallet.publicKey,
                    data,
                    signature: new Wallet().sign(data)
                })
            ).toBe(false);
        });
    });

    describe('createTransaction()', () => {
        describe('the amount is bigger than the balance', () => {
            it('throws an error', () => {
                expect(() => wallet.createTransaction({amount: 10000000000000, recipient: 'random-recipient'})).toThrow('Amount exceeded balance')
            });
        });

        describe('the amount is less than the balance', () => {
            let transaction, amount, recipient;

            beforeEach(() => {
                amount = 50;
                recipient = 'random-recipient';
                transaction = wallet.createTransaction({amount,recipient});
            });

            it('create an instance of Transaction', () => {
                expect(transaction instanceof Transaction).toBe(true);
            });

            it('matches the transaction input with the wallet', () => {
                expect(transaction.input.address).toEqual(wallet.publicKey);
            });

            it('outputs the amount to the recipient', () => {
                expect(transaction.outputMap[recipient]).toEqual(amount);
            });
        });
    });

    describe('calculateBalance()', () => {
        let blockchain;


        beforeEach(() => {
            blockchain = new Blockchain();
        });

        describe('no outputs for the wallet', () => {
            it('returns the STARTING_BALANCE', () => {
                expect(
                    Wallet.calculateBalance({
                        chain: blockchain.chain,
                        address: wallet.publicKey
                    })
                ).toEqual(STARTING_BALANCE);

            });
        });

        describe('there are outputs for the wallet', () => {
            let transactionOne, transactionTwo;

            beforeEach(() => {
                transactionOne = new Wallet().createTransaction({
                    recipient:wallet.publicKey,
                    amount: 50
                })

                transactionTwo = new Wallet().createTransaction({
                    recipient:wallet.publicKey,
                    amount: 100
                })

                blockchain.addBlock({data: [transactionOne, transactionTwo]});
            });

            it('add the sum of all outputs to the wallet balance', () => {
                expect(
                    Wallet.calculateBalance({
                        chain: blockchain.chain,
                        address: wallet.publicKey
                    })
                ).toEqual(
                    STARTING_BALANCE +
                    transactionOne.outputMap[wallet.publicKey] +
                    transactionTwo.outputMap[wallet.publicKey]
                );
            });
        });
    });
});