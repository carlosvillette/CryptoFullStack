const express = require('express');
const Blockchain = require('./blockchain');
const  port = 3000;


const app = express();
const blockchain = new Blockchain();

app.get('/api/blocks', (req,res) => {
    res.json(blockchain.chain);
});

app.listen(port, () => {

    console.log(`listening at localhost:${port}`);
});