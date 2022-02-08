const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const PubSub = require('./app/pubsub');
const Blockchain = require('./blockchain/blockchain');

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({blockchain});

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

const syncChains = () => {
    request({url: `${ROOT_NODE_ADDRESS}/api/blockchain`}, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);

            console.log('replace chain on a sync with', rootChain);
            blockchain.replaceChain(rootChain);
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
    }

});