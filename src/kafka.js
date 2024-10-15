const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'polling-system',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'poll-consumer-group' });

module.exports = { producer, consumer };
