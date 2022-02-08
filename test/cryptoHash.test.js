const cryptoHash = require('../util/cryptoHash');

describe('cryptoHash', () =>{
    const hash = "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae";

    it('generates a SHA256 hash output', () => {
        expect(cryptoHash('foo')).toEqual(hash);
    });

    it('produces the same hash no matter the order', () => {
        expect(cryptoHash('a','b','c')).toEqual(cryptoHash('c','b','a'));
    });
});