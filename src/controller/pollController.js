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
   return res.json({ id: result.rows[0].id });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create poll' });
  }
};

// Vote on a poll
exports.voteOnPoll = async (req, res) => {
  const pollId = req.params.id;
  const { option } = req.body;

  try {
    await producer.connect();
    await producer.send({
      topic: 'poll-votes',
      messages: [{ value: JSON.stringify({ pollId, option }) }],
    });

   return res.json({ message: 'Vote registered' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send vote' });
  }
};

exports.leaderboard = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT jsonb_object_keys(options) AS option, sum((options->>'votes')::int) AS total_votes
      FROM polls
      GROUP BY option
      ORDER BY total_votes DESC
      LIMIT 10;
    `);
    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: 'Error retrieving leaderboard' });
  }
}
