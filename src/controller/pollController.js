const pool = require('../db');
const { producer } = require('../kafka');

// Create a new poll
exports.createNewPoll = async (req, res) => {
  const { question, options } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO polls (question, options) VALUES ($1, $2) RETURNING id',
      [question, JSON.stringify(options)]
    );
    res.json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create poll' });
  }
};

// Vote on a poll
exports.voteOnPoll =async (req, res) => {
  const pollId = req.params.id;
  const { option } = req.body;

  try {
    await producer.connect();
    await producer.send({
      topic: 'poll-votes',
      messages: [{ value: JSON.stringify({ pollId, option }) }],
    });

    res.json({ message: 'Vote registered' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send vote' });
  }
};

