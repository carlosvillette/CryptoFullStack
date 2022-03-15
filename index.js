const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');

const PubSub = require('./app/pubsub');
const Blockchain = require('./blockchain/blockchain');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet/wallet');
const TransactionMiner = require('./app/transaction-miner');

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({blockchain, transactionPool});
const transactionMiner = new TransactionMiner({blockchain,transactionPool,wallet,pubsub});

const DEFAULT_PORT = 3000;

const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

pubsub.connect();

app.use(bodyParser.json());

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
    res.sendFile(path.join(__dirname,  './client/index.html'));
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

let PEER_PORT;

if (process.env.GENERATE_PEER_PORT ==='true') {
    // will give a random port between 3001-4000
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
// if PEER_PORT is undefined, DEFAULT_PORT will be selected instead
const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`listening at localhost:${PORT}`);
    // no reason for root node to sync with itself
    if (PORT !== DEFAULT_PORT){
        syncChains();
        syncTransaction();
    }

});