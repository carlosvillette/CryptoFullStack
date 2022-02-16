const cryptoHash = require('../util/cryptoHash');

describe('cryptoHash', () =>{
    const hash = "b2213295d564916f89a6a42455567c87c3f480fcd7a1c15e220f17d7169a790b";

    it('generates a SHA256 hash output', () => {
        expect(cryptoHash('foo')).toEqual(hash);
    });

    it('produces the same hash no matter the order', () => {
        expect(cryptoHash('a','b','c')).toEqual(cryptoHash('c','b','a'));
    });

    it('produces a unique hash when the properties have changed on an input', () => {
        const bar = {};
        const originalHash = cryptoHash(bar);
        bar['a'] = 'a';
        expect(cryptoHash(bar)).not.toEqual(originalHash);
    });
});