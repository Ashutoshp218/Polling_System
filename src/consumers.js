const pool = require('./db');
const { consumer } = require('./kafka');
const { broadcast } = require('./websocket');

// Kafka Consumer to process votes
const startConsumer = async () => {
  await consumer.subscribe({ topic: 'poll-votes', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { pollId, option } = JSON.parse(message.value.toString());

      const pollQuery = 'SELECT question, options FROM polls WHERE id = $1';
      const updateQuery = 'UPDATE polls SET options = $1 WHERE id = $2';

      try {
        const result = await pool.query(pollQuery, [pollId]);
        const poll = result.rows[0];
        const options = JSON.parse(poll.options);

        options[option].votes += 1;
        await pool.query(updateQuery, [JSON.stringify(options), pollId]);

        const updatedPoll = { pollQuestion: poll.question, options };
        broadcast(updatedPoll);
      } catch (err) {
        console.error('Failed to update poll votes:', err);
      }
    },
  });
};

module.exports = startConsumer;
