const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId : 'guru-app',
    brokers: ['localhost:9092']
});

const producer = kafka.producer();

const connectKafka = async()=> {
    await producer.connect();
    console.log('Kafka Producer Terhubung')
};

module.exports = {producer, connectKafka};

