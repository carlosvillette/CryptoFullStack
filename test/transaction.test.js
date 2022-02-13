const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet/wallet');
const {verifySignature} = require('../util/elliptic');

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
});