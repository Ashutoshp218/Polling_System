const express = require('express');
const {createNewPoll, voteOnPoll} = require('../controller/pollController')

const router = express.Router();


router.post('/polls', createNewPoll);

router.post('/polls/:id/vote', voteOnPoll);

module.exports = router;
