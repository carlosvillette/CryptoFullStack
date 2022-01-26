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

        await this.subscriber.subscribe(CHANNELS.TEST);

        await this.subscriber.on(
            'message',
            (channel, message) => this.handleMessage(channel, message)
        );
    }

    handleMessage(channel, message) {
        console.log(`message received.\n Channel: ${channel}.\n Message: ${message}\n`);
    }
}

const testPubSub = new Pubsub();
testPubSub.connect();

testPubSub.publisher.publish(CHANNELS.TEST, 'Hello World');