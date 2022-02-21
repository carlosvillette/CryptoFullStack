const Redis = require('ioredis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};

class Pubsub {
    constructor({blockchain, transactionPool}) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;

        this.publisher = new Redis();
        this.subscriber = new Redis();



    }

    connect() {

        this.subscriber.on(
            'message',
            (channel, message) => this.handleMessage(channel, message)
        );
        this.subscribeToChannels();

    }

    handleMessage(channel, message) {
        console.log(`message received.\n Channel: ${channel}.\n Message: ${message}\n`);

        const parsedMessage = JSON.parse(message);

        switch (channel) {
            case CHANNELS.BLOCKCHAIN:
                this.blockchain.replaceChain(parsedMessage);
                break;
            case CHANNELS.TRANSACTION:
                this.transactionPool.setTransaction(parsedMessage);
                break;
            default:
                return;
        }

    }

    subscribeToChannels() {
        for (const CHANNEL of Object.values(CHANNELS)) {
            this.subscriber.subscribe(CHANNEL, () => {
                console.log(`Added channel: ${CHANNEL}\n`);
            });
        }
    }

    publish({channel, message}) {
        //don't want node to send to recieve messages it itself has published
        this.subscriber.unsubscribe(channel, () => {
            this.publisher.publish(channel, message, () => {
                this.subscriber.subscribe(channel);
            });
        });

        //this.publisher.publish(channel, message);
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });

    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        })
    }
}


module.exports = Pubsub;