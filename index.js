const express = require('express');
const Blockchain = require('./blockchain');
const bodyParser = require('body-parser');
const PubSub = require('./pubsub');
const  port = 3000;

const app = express();
app.use(bodyParser.json());
const blockchain = new Blockchain();
const pubsub = new PubSub({blockchain});

pubsub.connect();
setTimeout(() => pubsub.broadcastChain(), 1000);


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

const DEFAULT_PORT = 3000;
let PEER_PORT;

if (process.env.GENERATE_PEER_PORT ==='true') {
    // will give a random port between 3001-4000
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
// if PEER_PORT is undefined, DEFAULT_PORT will be selected instead
const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`listening at localhost:${PORT}`);
});