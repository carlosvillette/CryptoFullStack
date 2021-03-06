const DIFFICULTY = 3;
const MINE_RATE = 1000;

const GENESIS_DATA = {
    timestamp: 1,
    lastHash: 'genesis',
    hash: 'genesis1',
    data: [],
    nonce: 0,
    difficulty: DIFFICULTY
};

const STARTING_BALANCE = 1000;

const  REWARD_INPUT = {
    address: '*reward-amount*'
};

const MINING_REWARD = 10;

module.exports = {GENESIS_DATA, MINE_RATE, STARTING_BALANCE, REWARD_INPUT, MINING_REWARD };