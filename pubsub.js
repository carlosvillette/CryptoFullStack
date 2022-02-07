const Redis = require('ioredis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
};

class Pubsub {
    constructor({blockchain}) {
        this.blockchain = blockchain;

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

        if (channel === CHANNELS.BLOCKCHAIN) {
            this.blockchain.replaceChain(parsedMessage)
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
        this.publisher.publish(channel, message);
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });

    }
}


module.exports = Pubsub;