const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST'
};

class Pubsub {
    constructor() {
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();


    }

    async connect() {
        await this.publisher.connect();
        await this.subscriber.connect();


        await this.subscriber.pSubscribe(
            CHANNELS.TEST,
            (message, channel) => this.handleMessage(message, channel)
        );
    }

    handleMessage(message, channel) {
        console.log(`message received.\n Channel: ${channel}.\n Message: ${message}\n`);
    }
}

const testPubSub = new Pubsub();
testPubSub.connect();
setTimeout(() => testPubSub.publisher.publish(CHANNELS.TEST, 'Hello World'),1000);