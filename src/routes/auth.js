const express = require('express');
const router = express.Router();
const {
  signUp,
  login,
  getUserByID,
  getJobLikesByUserID,
  fillProfile,
  logout,
  getJobPostedByUserID
} = require('../controller/auth');

// Post routes
router.post('/signup', signUp);
router.post('/login', login);

// Put routes
router.put('/fillProfile/:userID', fillProfile);

// Get routes
router.get('/:userID', getUserByID);
router.get('/jobLikes/:userID', getJobLikesByUserID);
router.get('/jobsPosted/:userID', getJobPostedByUserID);
router.get('/logout', logout);

module.exports = router;
