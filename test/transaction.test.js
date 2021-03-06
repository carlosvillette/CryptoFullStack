const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet/wallet');
const {verifySignature} = require('../util/elliptic');
const {REWARD_INPUT, MINING_REWARD} = require('../config');

describe('Transaction', () => {
    let transaction, senderWallet, recipient, amount;

    beforeEach(() => {
        senderWallet = new Wallet();
        recipient = 'recipient-public-key';
        amount = 100;

        transaction = new Transaction({ senderWallet, recipient, amount});
    });

    it('has an id', () => {
        expect(transaction).toHaveProperty('id');
    });

    describe('outputMap', () => {
        it('has an outputMap', () => {
            expect(transaction).toHaveProperty('outputMap');
        });

        it("outputs the amount to the recipient", () => {
            expect(transaction.outputMap[recipient]).toEqual(amount);
        });

        it("outputs the remaining balance of the sender wallet", () => {
            expect(transaction.outputMap[senderWallet.publicKey])
                .toEqual(senderWallet.balance - amount);
        });
    });

    describe('input', () => {
        it('has an input', () => {
            expect(transaction).toHaveProperty('input');
        });

        it('has a timestamp in the  input', () => {
            expect(transaction.input).toHaveProperty('timestamp');
        });

        it('sets the amount to the sender wallet balance', () => {
            expect(transaction.input.amount).toEqual(senderWallet.balance);
        });

        it('sets the address to the senderWallet public key', () => {
            expect(transaction.input.address).toEqual(senderWallet.publicKey);
        });

        it('signs the input', () => {
            expect(
                verifySignature({
                    publicKey: senderWallet.publicKey,
                    data: transaction.outputMap,
                    signature: transaction.input.signature
                })
            ).toBe(true);
        });
    });

    describe('validtransaction', () => {
        let errorMock;

        beforeEach(() => {
            errorMock = jest.fn();

            global.console.error = errorMock;
        });

        describe('when the transaction is valid', () => {
            it('returns true',  () => {
                expect(Transaction.validTransaction(transaction)).toBe(true);
            });
        });

        describe('when the transaction is invalid', () => {
            describe('and a transaction outputMap value is invalid', () => {
                it('returns false and logs an error',  () => {
                    transaction.outputMap[senderWallet.publicKey] = 12323444;

                    expect(Transaction.validTransaction(transaction)).toBe(false);
                    expect(errorMock).toHaveBeenCalled();
                });
            });

            describe('and the transaction input signature is invalid', () => {
                it('returns false and logs an error',  () => {
                    transaction.input.signature = new Wallet().sign('datum');

                    expect(Transaction.validTransaction(transaction)).toBe(false);
                    expect(errorMock).toHaveBeenCalled();
                });
            });
        });

        describe('update()', () => {
            let originalSignature, originalSenderOutput, nextRecipient, nextAmount;

            describe('and the amount is valid', () => {
                beforeEach(() => {
                    originalSignature = transaction.input.signature;
                    originalSenderOutput = transaction.outputMap[senderWallet.publicKey];
                    nextRecipient = 'next-recipient';
                    nextAmount = 50;

                    transaction.update({senderWallet, recipient: nextRecipient, amount: nextAmount});
                });

                it('outputs the amount to the next recipient', () => {
                    expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount);
                });

                it('subtracts the amount from the sender output amount', () => {
                    expect(transaction.outputMap[senderWallet.publicKey]).toEqual(originalSenderOutput - nextAmount);
                });

                it('maintains a total output value that matches the input amount', () => {
                    expect(
                        Object.values(transaction.outputMap)
                            .reduce((total, outputAmount) => total + outputAmount)
                    ).toEqual(transaction.input.amount);
                });

                it('resigns the transaction', () => {
                    expect(transaction.input.signature).not.toEqual(originalSignature);
                });

                describe('update for a recipient that is already included', ()=> {
                    let oldRecipientAmount;
                    let oldSenderWalletBalance;
                    let addedAmount;
                    beforeEach(() => {
                        oldRecipientAmount = transaction.outputMap[nextRecipient];
                        oldSenderWalletBalance = transaction.outputMap[senderWallet.publicKey];
                        addedAmount = 60;
                        transaction.update({senderWallet, recipient: nextRecipient, amount: addedAmount});
                    });

                    it('adds to the recipient amount', () => {
                        expect(transaction.outputMap[nextRecipient]).toEqual(oldRecipientAmount + addedAmount);
                    });

                    it('subtract amount from the original sender waller amount', () => {
                        expect(transaction.outputMap[senderWallet.publicKey]).toEqual(oldSenderWalletBalance - addedAmount);
                    });


                });
            });

            describe('and the amount is invalid', ()=> {
                it('throws an error', ()=> {
                    //needed to wrap transaction.update in callback function for test to work
                    expect(() => {
                        transaction.update({
                            senderWallet, recipient: 'foo', amount: 1000000000000
                        })
                    }).toThrow('Amount exceeds balance');
                });
            });



        });
    });

    describe('rewardTransaction()', () => {
        let rewardTransaction, minerWallet;

        beforeEach(() => {
            minerWallet = new Wallet();
            rewardTransaction = Transaction.rewardTransaction({minerWallet})
        });

        it('create a transaction with the reward input', ()=> {
            expect(rewardTransaction.input).toEqual(REWARD_INPUT);
        });

        it('create one transaction with the MINER_REWARD', ()=> {
            expect(rewardTransaction.outputMap[minerWallet.publicKey]).toEqual(MINING_REWARD);
        });
    });
});