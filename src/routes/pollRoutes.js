const express = require('express');
const {createNewPoll, voteOnPoll, leaderboard} = require('../controller/pollController')

const router = express.Router();


router.post('/polls', createNewPoll);

router.post('/polls/:id/vote', voteOnPoll);

router.get('/leaderboard', leaderboard);

module.exports = router;
