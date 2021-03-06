const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');

const PubSub = require('./app/pubsub');
const Blockchain = require('./blockchain/blockchain');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet/wallet');
const TransactionMiner = require('./app/transaction-miner');

const isDevelopment = process.env.ENV === 'development';

const DEFAULT_PORT = 3000;

const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;
const REDIS_URL = isDevelopment ?
    'redis://127.0.0.1:6379':
    'redis://:p11e959fe393cb8d68c995c1509d1d30d91933baa51e2a0bb645f40ce71f068ce@ec2-18-233-11-101.compute-1.amazonaws.com:10599';

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({blockchain, transactionPool, redisUrl: REDIS_URL});
const transactionMiner = new TransactionMiner({blockchain,transactionPool,wallet,pubsub});


pubsub.connect();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('/api/blockchain', (req,res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req,res) => {
    const data = req.body;
    blockchain.addBlock(data);
    pubsub.broadcastChain();
    res.json({
        note: `Block ${blockchain.chain.length} has been mined successfully`,
        block: blockchain.chain[blockchain.chain.length - 1]
    });
});

app.post('/api/transact', (req,res) => {
    const {amount, recipient} = req.body;

    let transaction = transactionPool.existingTransaction({address: wallet.publicKey});

    try {
        if (transaction) {
            transaction.update({senderWallet: wallet,recipient,amount});
        } else {
            transaction = wallet.createTransaction({
                recipient,
                amount,
                chain: blockchain.chain
            });
        }



    } catch (err) {
       return res.status(400).json({type: 'error', message: err.message});
    }


    transactionPool.setTransaction(transaction);
    pubsub.broadcastTransaction(transaction);

    res.status(200).json({type: 'success',transaction});
});

app.get('/api/transaction-pool-map', (req,res) => {
    res.json(transactionPool.transactionMap);
});

app.get('/api/mine-transactions', (req,res) => {
    transactionMiner.mineTransaction();

    res.redirect('/api/blockchain');
});

app.get('/api/wallet-info', (req,res) => {
    const address = wallet.publicKey;
    res.json({
        address,
        balance: Wallet.calculateBalance({
            chain: blockchain.chain,
            address
        })
    });
});

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname,  './client/dist/index.html'));
});

const syncChains = () => {
    request({url: `${ROOT_NODE_ADDRESS}/api/blockchain`}, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);

            console.log('replace chain on a sync with: \n', rootChain);
            blockchain.replaceChain(rootChain);
        }
    });
};

const syncTransaction = () => {
    request({url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map`}, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootTransactionMap = JSON.parse(body);

            console.log('replace transaction map on sync with: \n', rootTransactionMap);
            transactionPool.setMap(rootTransactionMap);
        }
    });
};

if (isDevelopment) {
    const wallet1 = new Wallet();
    const wallet2 = new Wallet();

    const generateWalletTransactions = ({wallet, recipient, amount}) => {
        const transaction = wallet.createTransaction({
            recipient, amount, chain: blockchain.chain
        });

        transactionPool.setTransaction(transaction);
    };

    const walletAction = () => generateWalletTransactions({
        wallet, recipient: wallet1.publicKey, amount: 5
    });

    const wallet1Action = () => generateWalletTransactions({
        wallet: wallet1, recipient: wallet2.publicKey, amount: 10
    });

    const wallet2Action = () => generateWalletTransactions({
        wallet: wallet2, recipient: wallet.publicKey, amount: 15
    });

    for (let i = 0; i < 10; i++) {
        if (i % 3 == 0) {
            walletAction();
            wallet1Action();
        } else if (i % 3 == 1) {
            walletAction();
            wallet2Action()
        } else {
            wallet1Action();
            wallet2Action();
        }

        transactionMiner.mineTransaction();
    }

}
let PEER_PORT;

if (process.env.GENERATE_PEER_PORT ==='true') {
    // will give a random port between 3001-4000
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
// if PEER_PORT is undefined, DEFAULT_PORT will be selected instead
// process.env.PORT is for heroku
const PORT = process.env.PORT || PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`listening at localhost:${PORT}`);
    // no reason for root node to sync with itself
    if (PORT !== DEFAULT_PORT){
        syncChains();
        syncTransaction();
    }

});