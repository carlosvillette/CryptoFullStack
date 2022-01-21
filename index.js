const express = require('express');
const Blockchain = require('./blockchain');
const bodyParser = require('body-parser');
const  port = 3000;


const app = express();
app.use(bodyParser.json());
const blockchain = new Blockchain();

app.get('/api/blockchain', (req,res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req,res) => {
    const data = req.body;
    blockchain.addBlock(data);
    res.json({
        note: `Block ${blockchain.chain.length} has been mined successfully`,
        block: blockchain.chain[blockchain.chain.length - 1]
    });
});

app.listen(port, () => {

    console.log(`listening at localhost:${port}`);
});