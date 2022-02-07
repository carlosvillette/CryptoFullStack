const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
};

class Pubsub {
    constructor({blockchain}) {
        this.blockchain = blockchain;

        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();
        //this.publisher.connect();
        //this.subscriber.connect();



    }

    connect() {
        this.publisher.connect();
        this.subscriber.connect();

        //this.subscribeToChannels();
        this.subscriber.on(
            'message',
            (channel, message) => this.handleMessage(channel, message)
        );
        this.subscribeToChannels();
        /*
                await this.subscriber.pSubscribe(
                    CHANNELS.TEST,
                    (message, channel) => this.handleMessage(message, channel)
                );

         */
    }

    handleMessage(channel, message) {
        console.log(`message received.\n Channel: ${channel}.\n Message: ${message}\n`);

        const parsedMessage = JSON.parse(message);

        if (channel === CHANNELS.BLOCKCHAIN) {
            this.blockchain.replaceChain(parsedMessage)
        }
    }

    subscribeToChannels() { // async
        for (const CHANNEL of Object.values(CHANNELS)) {
            this.subscriber.subscribe(CHANNEL, () => {
                console.log(`Added channel: ${CHANNEL}\n`);
            });
        }
    }

    publish({channel, message}) { //async
        //setTimeout(() => this.publisher.publish(channel, message),3000);
        //setTimeout(() => this.handleMessage(message,channel), 1000);
        this.publisher.publish(channel, message);
        //this.handleMessage(channel, message);
    }

    broadcastChain() { //async
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });

    }
}


/*
const testPubSub = new Pubsub();
testPubSub.connect();
setTimeout(() => testPubSub.publisher.publish(CHANNELS.TEST, 'Hello World'),1000);
 */
module.exports = Pubsub;